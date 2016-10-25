import React, { Component } from 'react';
 
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
 
import Task from './Task.jsx';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 

const styles = {
  checkbox: {
    marginTop: 12,
    marginLeft: 12,
  },
  label:{
    whiteSpace: "nowrap"
  },
  button:{margin: 12,},
  dtpicker:{marginLeft: 20,width:100}
}; 
// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      pics: [
      { _id: 1, text: 'This is task 1' },
      { _id: 2, text: 'This is task 2' },
      { _id: 3, text: 'This is task 3' },
      { _id: 4, text: 'This is task 4' },
      { _id: 5, text: 'This is task 5' },
      { _id: 6, text: 'This is task 6' },
    ],
    };
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  toggleSelAll(evt, checked) {
    var clds = this.props.children;
    console.log(clds);
  }
  
  getTasks() {
    return this.state.pics;
  }
 
  renderTasks() {
    return this.getTasks().map((task) => (
      <Task key={task._id} task={task}/>
    ));
  }
 
  render() {
    return (
      <div id="container" className="container">
 <Toolbar>
        <ToolbarGroup firstChild={true}>
         <DatePicker hintText="选择目录" 
          autoOk={true}
          style={styles.dtpicker}
         />
        </ToolbarGroup>

        <ToolbarGroup >
    <RaisedButton label="通过" primary={true} style={styles.button} />
    <RaisedButton label="删除" secondary={true} style={styles.button} />        
        <ToolbarSeparator />
          <Checkbox
            label="全选"
            onCheck={this.toggleSelAll.bind(this)}
            style={styles.checkbox}
            labelStyle={styles.label}
          />
        </ToolbarGroup>
</Toolbar>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};