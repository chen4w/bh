import React, { Component, PropTypes } from 'react';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 
const settings = require('../../settings.js');

const style = {
  //height: 100,
  //width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  checkbox: {
    marginTop: 10,
    float: "left"
  },
}; 
// Paint component - represents a single todo item
export default class Shoot extends Component {
  constructor(props) {
    super(props);
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  render() {
     return (
    <div id="container" className="container">
      <h1>这是拍照上传页面</h1>
    </div>      
    );
  }
}
 
Shoot.propTypes = {
};

Shoot.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};