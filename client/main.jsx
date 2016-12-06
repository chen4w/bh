import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { renderRoutes,renderShare } from '../imports/startup/client/routes.jsx';

import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}
const settings = require('../settings.js');


Meteor.startup(() => {
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();
  if(settings.share_only){
      ReactDOM.render(renderShare(), document.getElementById('app'));
  }else{
      ReactDOM.render(renderRoutes(), document.getElementById('app'));
  }
});