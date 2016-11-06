import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '../imports/ui/App.jsx';
//import { renderRoutes } from '../imports/startup/client/routes.jsx';

import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}
const settings = require('../settings.js');

let inf={};
let socket = require('socket.io-client')('http://'+settings.host+':'+settings.port_sock);
inf.sock = socket;
socket.on('connect', function() {
  console.log('Client connected');
});
socket.on('disconnect', function() {
  console.log('Client disconnected');
});
socket.on('added', function(data) {
  console.log('added:'+data);
  inf.app.onItemAdded(data);
});
socket.on('deleted', function(data) {
  console.log('deleted:'+data);
  inf.app.onItemDeleted(data);
});

Meteor.startup(() => {
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();
  //render(renderRoutes(), document.getElementById('app'));
  inf.app = render(<App />, document.getElementById('app'));
  console.log(app);
});