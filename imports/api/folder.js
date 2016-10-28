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

});