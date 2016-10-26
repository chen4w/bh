import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
 
Meteor.startup(() => {
  var injectTapEventPlugin = require("react-tap-event-plugin");
  injectTapEventPlugin();
  render(renderRoutes(), document.getElementById('app'));
});