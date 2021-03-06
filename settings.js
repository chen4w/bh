var path = require("path");
//var crypto = require('crypto');

class Setting {
  constructor() {
    /**-------必须修改的配置-------**/
    this.bRegister = true;
    //this.share_only = true;
    //this.host = '172.16.2.250';  //服务的ip地址,用于移动App请求
    //this.host = '192.168.221.198';
    this.host = '192.168.1.115';
    //this.host = '172.16.2.231';
    
    //服务端文件目录分隔符,client端无法自动获取服务的 path.sep
    //图片文件根目录
    if(path.sep=='/')
      this.pic_root = "/Users/c4w/git/pics";
    else
      this.pic_root = "c:\\git\\pics";
    

  /**-------默认配置即可-------**/
    this.version='2016.12.12';
    //必须是唯一的名称,将其hash值作为云端唯一标识
    this.sn = '杭州工艺美术博物馆';
    this.sn_md5 = '81949faebfe3c5ff42bcbd5c06a06511';
    
    //smtp服务账号,用于发送密码重置或验证
    //this.mail_url = 'smtp://sinosoftechtest:sinosoft123456@smtp.sina.com'; 
    //this.mail_from = 'sinosoftechtest@sina.com'; 
    this.mail_url = 'smtp://hzacm_bhere:hzacm123@smtp.163.com'; 
    this.mail_from = 'hzacm_bhere@163.com'; 
    //this.mail_url = 'smtp://chen4w:313wansheng@smtp.163.com'; 
    //this.mail_from = 'chen4w@163.com'; 

    this.share_limit = 5;//社交分享无限滚动每次加载张数
    this.show_limit = 10; //移动终端最多显示的待检查图片数量

    this.pic_url = '/img/'; //图片url起始路径
    this.port_sock = 8200;  //webSocket端口
    this.port_web = 3000; //web端口
    this.stabilityThreshold = 1000; //监测文件延时,直到此时间(ms)内文件不再增长才触发added消息
    this.cacheSpan = 200; //缓存延时,避免cpu阻塞
    this.rotateSpan = 50;//旋转图片延时，避免cpu阻塞

    this.thumbnails_size=450; //默认的抽点尺寸
    this.thumbnails_uri ='tbnails'; //抽点保留路径名
    this.fs_cache = true; //是否进行缓存延迟,避免批量抽点导致僵死

    this.pic_upload = 'upload';   //上传目录
    this.pic_archive = 'archive';   //归档目录
    this.pic_wallpaper = 'wallpaper'; //墙纸目录

    //常用间接设置量,
    this.url_root = 'http://'+this.host+ ':'+this.port_web
      +this.pic_url;
    //二维码对应的拍照上传url,如果不设置直接取当前网页location
    this.url_upload = 'http://'+this.host+ ':'+this.port_web+'/shoot';
    //this.sn_md5 = crypto.createHash('md5').update(this.sn).digest("hex");
    //console.log('sn:'+this.sn+' md5:'+this.sn_md5);
      
  }
}
module.exports =  (new Setting);