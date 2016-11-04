import { Meteor } from 'meteor/meteor';
import '../imports/api/folder.js';

import {watch} from  './guard.js';

Meteor.startup(() => {
  
  //for windows and mac path
  const path = require('path');
  const fs = require('fs');
  const settings = require('../settings.js');

  //start dir watch
  watch();

  //a simple static files server for easy deploy 
  WebApp.connectHandlers.use(settings.pic_url, (req, res) => {
    let fp =  settings.pic_root + req.url.replace(/\//g,path.sep);
    let fpath = decodeURIComponent(fp);
    console.log(fpath);
    if (fs.existsSync(fpath)) {
        let data = fs.readFileSync(fpath, data);
        res.writeHead(200, {'Content-Type': 'image'});
        res.write(data);
        res.end();
    }else{
      res.writeHead(404);
      res.end(fpath+" not found");
    }
  });
});
