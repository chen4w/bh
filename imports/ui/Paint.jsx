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
// Paint component - represents a single todo item
export default class Paint extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      bSel: props.bsel,
    };
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  render() {
    let imgsrc = "/pics/"+this.props.pic;
    let depth = this.props.bsel?5:1;
    return (
       <Paper style={style} zDepth={depth}  
       onTouchTap={this.props.par.toggleSel.bind(this.props.par,this.props.pos)}>
       <img width="250em" src={imgsrc}/>
       </Paper>
      
    );
  }
}
 
Paint.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  pic: PropTypes.string.isRequired,
};

Paint.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};