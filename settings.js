var path = require("path");

class Setting {
  constructor() {
    this.url_upload = "http://facebook.github.io/react/";
    this.share_limit = 5;//社交分享无限滚动每次加载张数
    this.show_limit = 10; //移动终端最多显示的待检查图片数量

    this.pic_url = '/img/'; //图片url起始路径
    this.port_sock = 8200;  //webSocket端口
    this.port_web = 3000; //web端口
    this.host = '172.16.2.72';  //服务的ip地址,用于移动App请求
    //this.host = '192.168.1.77';
    this.stabilityThreshold = 2000; //监测文件延时,直到此时间(ms)内文件不再增长才触发added消息

    this.thumbnails_size=450; //默认的抽点尺寸
    this.thumbnails_uri ='tbnails'; //抽点保留路径名
    this.fs_cache = true; //是否进行缓存

    this.pic_upload = 'upload';   //上传目录
    this.pic_archive = 'archive';   //归档目录
    this.pic_wallpaper = 'wallpaper'; //墙纸目录

    //图片文件根目录
    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\pics";
    //常用间接设置量,
    this.url_root = 'http://'+this.host+ ':'+this.port_web
      +this.pic_url;
  }
}
module.exports =  (new Setting);