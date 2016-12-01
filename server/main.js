import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import '../imports/api/folder.js';

import {watch} from  './guard.js';
const uuid = require('node-uuid');

//for windows and mac path
const path = require('path');
const fs = require('fs');
const settings = require('../settings.js');
//for mac
//const gm = require('gm').subClass({imageMagick: true});
const gm = require('gm');
const NodeCache = require( "node-cache" );
//缓存失效时间设置为1天, 每小时检查一次,不使用clone
const fsCache = new NodeCache({ stdTTL: 24*3600, checkperiod: 3600, useClones:false });

const path_tbn = settings.thumbnails_uri + settings.thumbnails_size+path.sep;

//cache原始图或抽点图,tbn_len=0:原始图, tbn_len>0 抽点图 
export function cacheFile(fpath,func) {
  //非抽点图
  if(fs.existsSync(fpath)) {
    let data = fs.readFileSync(fpath);
    if(settings.fs_cache){
      fsCache.set(fpath,data);
    }
    if(func){
      func(data);
    }
  }else{
      //处理抽点规则
      let p1 = fpath.lastIndexOf(path.sep);
      let p0 = fpath.lastIndexOf(path.sep,p1-1);
      let tbn_len = 0;
      if(p0!=-1 && p1!=-1){
        let fsize = fpath.substring(p0+1,p1);
        if(fsize.indexOf(settings.thumbnails_uri)==0){
          let tbn = fsize.substring(settings.thumbnails_uri.length);
          tbn_len = parseInt(tbn);
        }
      }
      let fpath_src = fpath.substring(0,p0)+fpath.substring(p1);
      //文件不存在
      if(tbn_len<=0 || !fs.existsSync(fpath_src)){
        console.log(fpath_src+' not found.')
        if(func){
          func(null);
        }
        return;
      }
      //抽点值>0 且源文件存在,返回抽点文件
      //优化性能,如果cache中有，直接从cache中读取
    let buf_src = fsCache.get(fpath_src);
    if(!buf_src){
      buf_src = fs.readFileSync(fpath_src);
      fsCache.set(fpath_src,buf_src);
    }
    gm(buf_src).autoOrient().resize(tbn_len).toBuffer(
      path.extname(fpath_src),
      function(err, buf) {
        if (err){
          console.log(err);
          if(func){
            func(null);
          }
          return;
        } 
        //cache thumbnail
        fsCache.set(fpath,buf);
        if(func)
          func(buf);
    });
  }
}

//缓存目录下所有图片,预先生成抽点
function cachePath(fpath,cb){
  //列出目录下所有文件
  let ls = fs.readdirSync(fpath).filter(function(file) {
      let en = path.extname(file);
      if((en ==='.jpg' || en==='.png') && 
        fs.statSync(path.join(fpath, file)).isFile())
        return true;
      else
        return false;
  });
  //console.log('caching '+ls.length+' pics from:'+ fpath);
  //改用异步方式,避免开始大量图片抽点造成机器僵死
  let pos =0;
  let len = ls.length;
  console.log('cache '+ls.length+' pics from:'+ fpath);
  if(len==0)
    return;

  //let fn = fpath+ path.sep + path_tbn + ls[pos];
  let func = function(pos){
    pos++;
    if(pos>=ls.length){
      if(cb){
        cb();
      }
      return;
    }
     let fn = fpath+ path.sep + path_tbn + ls[pos];
     console.log('cache file '+(pos+1)+'/'+len+':'+fn);
     setTimeout(function(){
      cacheFile(fn,func(pos));
     },200);
  }
  func(-1);
}

Meteor.startup(() => {
  //设置邮件发送服务
  if(settings.mail_url)
    process.env.MAIL_URL = settings.mail_url;  

  Accounts.emailTemplates.from = settings.mail_from;
  Accounts.emailTemplates.resetPassword.subject=function(user, url) {
    return  settings.sn+' 重置密码的邮件';
  }
  //reset mail content
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    //remove /# from url
    console.log('url:'+url);
    let p0 = url.indexOf('#');
    //替换默认的localhost:3000
    //let link = url.substring(0,p0)+url.substring(p0+2);
    let link = 'http://'+settings.host+':'+settings.port_web+url.substring(p0+1);
    return '访问以下链接可重设您的密码:\n' + link;
  };

  Accounts.emailTemplates.resetPassword.html = function (user, url) {
    let p0 = url.indexOf('#');
    //let link = url.substring(0,p0)+url.substring(p0+2);
     let link = 'http://'+settings.host+':'+settings.port_web+url.substring(p0+1);
  return  " 访问以下链接可重设您的密码:\n<br/><a href=\""
    + link+"\">"+link+"</a>";
  };

  //start dir watch
  watch();
  //cache pic_upload path
  cachePath(path.join(settings.pic_root, settings.pic_upload),function(){
    cachePath(path.join(settings.pic_root, settings.pic_wallpaper));
  });
  //a simple static files server for easy deploy 
  //handle get pic req
  WebApp.connectHandlers.use(settings.pic_url, (req, res) => {
    let fp =  settings.pic_root + req.url.replace(/\//g,path.sep);
    let fpath = decodeURIComponent(fp);
     //先尝试读取缓存
    let data = fsCache.get(fpath);
    if(data){
        console.log('hit cache:'+fpath);
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
        return;      
    }
    cacheFile(fpath,function(data){
      if(!data){
          res.writeHead(404);
          res.end(fpath+" not found");
      }else{
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
      }
    });
  });

//handle post file req
WebApp.connectHandlers.use('/'+settings.pic_upload, (req, res) => {
  let ct = req.headers['content-type'].toLowerCase();
  let ftype = (ct.indexOf('/png')==-1)?'.jpg':'.png';
   let fn = path.join(
     settings.pic_root,
     settings.pic_upload,
     uuid.v1()+ftype);
     console.log('upload file:'+ fn +'  method:'+req.method);
    let file = fs.createWriteStream(fn); 
    file.on('error',function(error){
      console.log(error);
      return;
    });
    file.on('finish',function(){
        res.writeHead(200) 
        res.end(); //end the respone 
        //console.log('Finish uploading, time taken: ' + Date.now() - start);
    });
    req.pipe(file); //pipe the request to the file  
  });
});
