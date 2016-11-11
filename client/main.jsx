import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';

import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}
const settings = require('../settings.js');

ginf={};
let socket = require('socket.io-client')('http://'+settings.host+':'+settings.port_sock);
ginf.sock = socket;
socket.on('connect', function() {
  console.log('Client connected');
});
socket.on('disconnect', function() {
  console.log('Client disconnected');
});
socket.on('added', function(data) {
  console.log('added:'+data);
  ginf.app.onItemAdded(data);
});
socket.on('deleted', function(data) {
  console.log('deleted:'+data);
  ginf.app.onItemDeleted(data);
});

Meteor.startup(() => {
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();
  ReactDOM.render(renderRoutes(), document.getElementById('app'));
});