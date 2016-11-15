import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {cf} from './fp.js';

Meteor.methods({
    //list all subfolder
  'folder.listfolder'() {
    return cf.listFolder();
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

 'pic.take'(data,fpath){
   cf.takePic(data,fpath,this.connection.clientAddress);
 }
});