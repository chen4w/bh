import { Meteor } from 'meteor/meteor';
import '../imports/api/folder.js';

import {watch} from  './guard.js';

Meteor.startup(() => {
  
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

  //start dir watch
  watch();

  //a simple static files server for easy deploy 
  WebApp.connectHandlers.use(settings.pic_url, (req, res) => {
    let fp =  settings.pic_root + req.url.replace(/\//g,path.sep);
    let fpath = decodeURIComponent(fp);
     //先尝试读取缓存
    let data = fsCache.get(fpath);
    if(data){
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
        //console.log('hit cache:'+fpath);
        return;      
    }
    if(fs.existsSync(fpath)) {
        data = fs.readFileSync(fpath, data);
        if(settings.fs_cache){
          fsCache.set(fpath,data);
          console.log('set cache:'+fpath);
        }
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
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
      //抽点值>0 且源文件存在,返回抽点文件
      if(tbn_len>0 && fs.existsSync(fpath_src)){
        gm(fpath_src).resize(tbn_len).stream(function streamOut (err, stdout, stderr) {
            if (err){
              console.log(err);
              return next(err);
            } 
            stdout.pipe(res); //pipe to response
            if(!settings.fs_cache){
              return;
            }
            //cache thumbnail
            let buf =[];
            stdout.on('data', function(chunk) {
              buf.push(chunk);
            });
            stdout.on('end', function() {
              //缓存抽点图
              let data = Buffer.concat(buf);
              fsCache.set(fpath,data);
            });  
        });
      }else{
        res.writeHead(404);
        res.end(fpath+" not found");
      }
    }
  });
});
