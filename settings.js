var path = require("path");

class Setting {
  constructor() {
    this.pic_url = '/img/';
    this.host = 'http://localhost:3000';

    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";
  }
}
module.exports =  (new Setting);