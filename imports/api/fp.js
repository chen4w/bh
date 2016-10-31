import { Meteor } from 'meteor/meteor';

const g_fs = require('fs');
const g_path = require('path');
const mv = require('mv');

class CFolder {
  constructor() {
  }
  pass(pics, bPass){
    console.log(pics+':'+bPass);
    pics.forEach(function(item){
      let fsrc = Meteor.settings.pics.root+g_path.sep+item;
      let pos = fsrc.lastIndexOf(g_path.sep);
      let fpath = fsrc.substring(0,pos);
      let fsub = bPass? 'p':'n';
      let ftarget = fsrc.substring(0,pos+1)+fsub+fsrc.substring(pos);
      console.log('src:'+fsrc+ '\ntarget:'+ftarget);
      mv(fsrc, ftarget,{mkdirp: true}, function(err) {
          // handle the error
          console.log(err);
      });
    });

  }

  getPics(fpath){
    let dir = Meteor.settings.pics.root+g_path.sep+fpath;
    let rl = [];
    if (!g_fs.existsSync(dir)) {
      return rl;
    }
    let files = g_fs.readdirSync(dir);
    files.forEach(function (fn) {
      let lfn = fn.toLowerCase();
      if(lfn.endsWith('png')||lfn.endsWith('jpg')||lfn.endsWith('jpeg'))
      rl.push({fn:fn});
    });
    return rl;
  }
  list(fpath) {
    return this.getChildren(Meteor.settings.pics.root);
  }
  listFolder(){
      let rl = [];
      this.walk(Meteor.settings.pics.root, rl);
      return rl;
  }
  walk(fpath, rl){
    //walk by absolute path, but return relative path
    rl.push(fpath.substring(Meteor.settings.pics.root.length+1));
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
