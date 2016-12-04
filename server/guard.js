import http from 'http';
import socket_io from 'socket.io';
import {cacheFile} from  './main.js';

const path = require("path");
const async = require('async');
const fs=require('fs');
const settings = require('../settings.js');

const path_tbn = settings.thumbnails_uri + settings.thumbnails_size+path.sep;

function getTbPath(fp){
    let p0 = fp.lastIndexOf(path.sep);
    if(p0!=-1){
        return settings.pic_root + path.sep+ fp.substring(0,p0+1)+path_tbn+fp.substring(p0+1);
    }else{
        return settings.pic_root + path.sep + path_tbn + fp;
    }
}
export function watch() {
    const root_len= settings.pic_root.length+1;
    async.auto({  
    config: function(cb){
        cb(null,{
            watchPath:'**/'
        });
    },
    file:['config','network', function (scope,cb) {  
        var filePath = scope.config.watchPath;
        var io = scope.network.io;
        console.log('watching '+settings.pic_root);
        var chokidar = require('chokidar');
        var cfg = {
            ignored: /[\/\\]\./,
            cwd:settings.pic_root,
            ignoreInitial: true
        };
        if(settings.stabilityThreshold){
            cfg.awaitWriteFinish= {
                stabilityThreshold: settings.stabilityThreshold,
                pollInterval: 100
            };
        }
        //for mac
        if(path.sep=='/'){
            cfg.usePolling=true;
        }

        var watcher = chokidar.watch(['**/*.jpg','**/*.png'],cfg);   
        watcher.on('add', fp => {
            cacheFile(getTbPath(fp),function(data){
                io.emit('added',[fp.replace(/\\/g,'/')]);
            });
        })
        .on('change', fp => {
            cacheFile(getTbPath(fp),function(data){
                io.emit('added',[fp.replace(/\\/g,'/')]);
            });
        })
        .on('unlink', fp => {
            io.emit('deleted',[fp.replace(/\\/g,'/')]);
            //console.log('unlink:'+fp);
        });

    }],  
  
    network: function (cb) {  
        const server = http.createServer();
        const io = socket_io(server);
        io.fs = fs;
        
        io.on('connection', function(client) {  
            console.log('Client connected...');
            //接受订阅消息,发送初始图片集合
            client.on('join', function(sp) {
                var fs = this.server.fs;
                var startPath='pics'+sp;
                if (!fs.existsSync(startPath)){
                    console.log("no dir ",startPath);
                    return;
                }
                var files=fs.readdirSync(startPath);
                var fs=[];
                for(var i=0;i<files.length;i++){
                    var f=files[i];
                    var fext = path.extname(f);
                    if(fext=== ".jpg" || fext === ".png") {
                        fs.push(sp+'/'+f);
                    }
                }
                if(fs.length>0){
                    client.emit('added', fs);
                }
            });

            client.on('messages', function(data) {
                client.emit('broad', data);
                client.broadcast.emit('broad',data);
            });

        });     
        //callback
        cb(null, { 
            io:io,
            server:server
        });  
    },
    ready:['network',function(scope,cb){
        //listen
        scope.network.server.listen(settings.port_sock);            
    }] 
    },function (err, result) {
		if (err) {
			logger.fatal(err)
		}
    }
  );  

}






