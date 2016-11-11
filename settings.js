var path = require("path");

class Setting {
  constructor() {
    this.pic_url = '/img/';
    this.port_sock = 8200;
    this.port_web = 3000;
    this.host = '192.168.1.77';
    this.delay = 1000;

    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";
  }
}
module.exports =  (new Setting);