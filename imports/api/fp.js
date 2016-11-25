
const g_fs = require('fs');
const g_path = require('path');
const mv = require('mv');
const uuid = require('node-uuid');
const settings = require('../../settings.js');

class CFolder {
  constructor() {
  }
  //真正的删除,拍照上传者删除自己上传的照片
  remove(pics,ipAddr){
    let ipstr = ipAddr.replace(/\./g,'-');
    pics.forEach(function(item){
      console.log(item+':'+ipstr);
      //非本人ip上传的照片禁止删除
      if(item.indexOf(ipstr)!=-1){
        let fsrc = settings.pic_root+g_path.sep+item;
        console.log('delete file:'+fsrc);
        g_fs.unlink(fsrc);
      }
    });
  }

  pass(pics, bPass){
    pics.forEach(function(item){
      let fsrc = settings.pic_root+g_path.sep+item;
      let pos = fsrc.lastIndexOf(g_path.sep);
      let fpath = fsrc.substring(0,pos);
      let ftarget=null;
      let fsub = bPass? 'p':'n';
      //已经通过或删除的文件需要特殊处理
      if(fpath.endsWith('/p') || fpath.endsWith('/n')){
          ftarget = fsrc.substring(0,pos-1)+fsub+fsrc.substring(pos);
      }else{
          ftarget = fsrc.substring(0,pos+1)+fsub+fsrc.substring(pos);
      }
      mv(fsrc, ftarget,{mkdirp: true}, function(err) {
          // handle the error
          if(err)
            console.log(err);
      });
    });
  }
  takePic(data,fpath,ipAddr){
    let fn = settings.pic_root
      + fpath+ g_path.sep
      + ipAddr.replace(/\./g,'-')  +'-'
      + uuid.v1()+".jpg";
    let base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
    g_fs.writeFile(fn, new Buffer(base64Data, 'base64'), function(err) {
      if(err)
        console.log(err);
    });
  }
  getPics(fpath,ipAddr){
    //convert url --> file path
    let dir = settings.pic_root+g_path.sep
      +fpath.replace(/\-/g,g_path.sep);
    console.log(dir);
    let rl = [];
    if (!g_fs.existsSync(dir)) {
      return rl;
    }
    let files = g_fs.readdirSync(dir);
    if(ipAddr)
      ipAddr=ipAddr.replace(/\./g,'-');
    files.forEach(function (fn) {
      let lfn = fn.toLowerCase();
      if(lfn.endsWith('png')||lfn.endsWith('jpg')||lfn.endsWith('jpeg')){
        if(!ipAddr || fn.indexOf(ipAddr)==0)
          rl.push({fn:fn});
      }        
    });
    return rl;
  }
  list(fpath) {
    return this.getChildren(settings.pic_root);
  }
  listFolder(fpath){
      let rl = [];
      this.walk(g_path.join(settings.pic_root,fpath), rl);
      return rl;
  }
  walk(fpath, rl){
    //walk by absolute path, but return relative path
    let pn = fpath.substring(settings.pic_root.length+1);
    //exclude the root path
    //忽略抽点目录
    if(pn!="" && pn.indexOf(settings.thumbnails_uri)==-1)
      rl.push(pn);
    let me = this;
    let l = me.getChildren(fpath);
    l.forEach(function (item, index, array) {
        me.walk(fpath+g_path.sep+item, rl);
    });
  }
  //sync call
  getChildren(cpath) {
    return g_fs.readdirSync(cpath).filter(function(file) {
        return g_fs.statSync(g_path.join(cpath, file)).isDirectory();
    });
  }
}

export const cf = new CFolder();
