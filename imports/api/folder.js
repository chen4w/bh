import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check ,Match} from 'meteor/check';
import {cf} from './fp.js';
import {rotatePics} from  '../../server/main.js';

Meteor.methods({
    //list all subfolder
  'folder.listfolder'(fpath) {
    check(fpath, String); 
    return cf.listFolder(fpath);
  },
  'folder.getpics'(fpath) {
    check(fpath, String); 
    return cf.getPics(fpath);
  },
  'folder.getMyPics'(fpath) {
    check(fpath, String); 
    return cf.getPics(fpath,this.connection.clientAddress);
  },  
 'pic.pass'(pics,bPass) {
    check(pics, [String]); 
    check(bPass, Boolean); 
    return cf.pass(pics,bPass);
  },
 'pic.remove'(pics) {
    check(pics, [String]); 
    return cf.remove(pics,this.connection.clientAddress);
  },
 'pic.rotate'(pics,angle) {
    check(pics, [String]); 
    check(angle, Match.Integer);     
    return rotatePics(pics,angle,0);
  },

 'pic.take'(data,fpath){
   cf.takePic(data,fpath,this.connection.clientAddress);
 }
});