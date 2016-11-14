import { Meteor } from 'meteor/meteor';
import '../imports/api/folder.js';

import {watch} from  './guard.js';

Meteor.startup(() => {
  
  //for windows and mac path
  const path = require('path');
  const fs = require('fs');
  const settings = require('../settings.js');
  const gm = require('gm').subClass({imageMagick: true});

  //start dir watch
  watch();

  //a simple static files server for easy deploy 
  WebApp.connectHandlers.use(settings.pic_url, (req, res) => {
    let fp =  settings.pic_root + req.url.replace(/\//g,path.sep);
    let fpath = decodeURIComponent(fp);
    console.log(fpath);
    if(fs.existsSync(fpath)) {
        let data = fs.readFileSync(fpath, data);
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
    }else{
      //处理抽点规则
      let p1 = fpath.lastIndexOf(path.sep);
      let p0 = fpath.lastIndexOf(path.sep,p1-1);
      let tbn_len = 0;
      if(p0!=-1 && p1!=-1){
        let fsize = fpath.substring(p0+1,p1);
        if(fsize.indexOf(settings.thumbnails_uri)==0){
          let tbn = fsize.substring(settings.thumbnails_uri.length);
          tbn_len = parseInt(tbn);
        }
      }
      let fpath_src = fpath.substring(0,p0)+fpath.substring(p1);
      //抽点值>0 且源文件存在,返回抽点文件
      if(tbn_len>0 && fs.existsSync(fpath_src)){
        gm(fpath_src).resize(tbn_len).stream(function streamOut (err, stdout, stderr) {
            if (err) return next(err);
            stdout.pipe(res); //pipe to response

            //also pipe to fs
            if(settings.thumbnails_cache){
              let fdir = fpath.substring(0,p1);
              if (!fs.existsSync(fdir)){
                fs.mkdirSync(fdir);
                console.log(fdir+" made");
              }
              let ws = fs.createWriteStream(fpath);
              stdout.pipe(ws);
            }
        });
      }else{
        res.writeHead(404);
        res.end(fpath+" not found");
      }
    }
  });
});
