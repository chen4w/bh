import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  // code to run on server at startup
  //for windows and mac path
  const path = require('path');
  const fs = require('fs');
  let img_url = Meteor.settings.pics? Meteor.settings.pics.root_url : "/img/";
  let img_path = Meteor.settings.pics? Meteor.settings.pics.root : 
    (path.sep=='/'? "/Users/c4w/git/bh/public/pics" : "c:\\pics");
  //a simple static files server for easy deploy 
  WebApp.connectHandlers.use(img_url, (req, res) => {
    let fpath = img_path + req.url.replace(/\//g,path.sep);
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
