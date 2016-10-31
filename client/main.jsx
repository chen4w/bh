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
const PORT = 8200;
let socket = require('socket.io-client')(`http://localhost:${PORT}`);

socket.on('connect', function() {
  console.log('Client connected');
});
socket.on('disconnect', function() {
  console.log('Client disconnected');
});


Meteor.startup(() => {
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();
  //render(renderRoutes(), document.getElementById('app'));
  render(<App />, document.getElementById('app'));
});