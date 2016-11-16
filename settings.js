var path = require("path");

class Setting {
  constructor() {
    this.show_limit = 10;

    this.pic_url = '/img/';
    this.port_sock = 8200;
    this.port_web = 3000;
    this.host = '192.168.1.77';
    this.delay = 0;

    this.thumbnails_size=450;
    this.thumbnails_uri ='tbnails';
    this.fs_cache = true;

    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";

    this.url_root = 'http://'+this.host+ ':'+this.port_web
      +this.pic_url;
  }
}
module.exports =  (new Setting);