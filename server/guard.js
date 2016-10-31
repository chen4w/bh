import http from 'http';
import socket_io from 'socket.io';

const path = require("path");
const async = require('async');
const fs=require('fs');
const PORT= 8200;

export function watch(canvas, options) {
    console.log('watch start---');
async.auto({  
    config: function(cb){
        cb(null,{
            watchPath:'**/'
        });
    },
    file:['config','network', function (scope,cb) {  
        var filePath = scope.config.watchPath;
        var gaze = require('gaze');

        var io = scope.network.io;
        // Watch all .js files/dirs in process.cwd()
        gaze([filePath+'*.png',filePath+'*.jpg'], function(err, watcher) {
            // Files have all started watching
            // Get all watched files
            var watched = this.watched();

            // On file changed
            this.on('changed', function(filepath) {
                console.log(filepath + ' was changed');
            });

            // On file added
            this.on('added', function(fp) {
                var pos = fp.lastIndexOf('pics/');
                io.emit('added',[fp.substring(pos+4)]);
            });

            // On file deleted
            this.on('deleted', function(filepath) {
                var inf = filepath + ' was deleted';
                io.emit('deleted',inf)
            });

            // On changed/added/deleted
            this.on('all', function(event, filepath) {
                var inf = filepath + ' was ' + event;
                console.log(inf);
                io.emit('all',inf)
            });
        });        
        cb(null, gaze);  
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
        scope.network.server.listen(PORT);            
    }] 
    },function (err, result) {
		if (err) {
			logger.fatal(err)
		}
    }
  );  

}






