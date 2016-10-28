import { Meteor } from 'meteor/meteor';

const g_fs = require('fs');
const g_path = require('path');
class CFolder {
  constructor() {
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
