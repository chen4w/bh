import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 

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
// Task component - represents a single todo item
export default class Task extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      bSel: false,
    };
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  toggleSel() {
    this.setState({
      bSel: !this.state.bSel,
    });
  }
  render() {
    var imgsrc = "/pics/upload/"+this.props.task._id+".png";
    var depth = this.state.bSel?5:1;
    return (
       <Paper style={style} zDepth={depth}  onTouchTap={this.toggleSel.bind(this)}>
       <img width="200" src={imgsrc}/>
       </Paper>
      
    );
  }
}
 
Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
};

Task.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};