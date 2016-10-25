import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';

var injectTapEventPlugin = require("react-tap-event-plugin");
 
Meteor.startup(() => {
  injectTapEventPlugin();
  render(<App />, document.getElementById('app'));
});