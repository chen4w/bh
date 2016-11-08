var path = require("path");

class Setting {
  constructor() {
    this.pic_url = '/img/';
    this.port_sock = 8200;
    this.port_web = 3000;
    this.host = '172.16.2.72';
    this.delay = 1000;

    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";
  }
}
module.exports =  (new Setting);