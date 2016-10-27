import { Meteor } from 'meteor/meteor';

/*const fp = {
    //list all sub directory
    list(pdir) {       
        let ls = this.getDirectories(Meteor.settings.pics.root);
        return ls;
    },
    getDirectories(srcpath,fs,path) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
}
export default fp;
*/
class CFolder {
  constructor() {
     this.fs = require('fs');
    this.path = require('path');
  }

  list(fpath) {
    return this.getDirectories(Meteor.settings.pics.root);
  }

  getDirectories(srcpath) {
    const fs = this.fs;
    const path = this.path;
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }

}

export const cf = new CFolder();
