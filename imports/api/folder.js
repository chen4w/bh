import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {cf} from './fp.js';

Meteor.methods({
    //list all subfolder
  'folder.list'(fpath) {
    check(fpath, String); 
    return cf.list(fpath);
  },
});