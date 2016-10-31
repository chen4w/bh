import { Meteor } from 'meteor/meteor';
import '../imports/api/folder.js';

import {watch} from  './guard.js';

Meteor.startup(() => {
  
  //for windows and mac path
  const path = require('path');
  const fs = require('fs');


  if(!Meteor.settings.pics){
    Meteor.settings.pics={
      root_url:'/img/',
      root: (path.sep=='/'? "/Users/c4w/git/pics" : "c:\\pics")
    };
  }
  //start dir watch
  watch();

  //a simple static files server for easy deploy 
  WebApp.connectHandlers.use(Meteor.settings.pics.root_url, (req, res) => {
    let fpath =  Meteor.settings.pics.root + req.url.replace(/\//g,path.sep);
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
