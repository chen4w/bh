var path = require("path");

class Setting {
  constructor() {
    this.show_limit = 10;

    this.pic_url = '/img/';
    this.port_sock = 8200;
    this.port_web = 3000;
    this.host = '172.16.2.72';
    //this.host = '192.168.1.99';
    this.stabilityThreshold = 2000;

    this.thumbnails_size=450;
    this.thumbnails_uri ='tbnails';
    this.fs_cache = true;
    this.pic_upload = 'upload';

    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";

    this.url_root = 'http://'+this.host+ ':'+this.port_web
      +this.pic_url;
  }
}
module.exports =  (new Setting);