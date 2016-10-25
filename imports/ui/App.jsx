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
    marginTop: 18,
    marginLeft: 12,
  },
  label:{
    whiteSpace: "nowrap"
  },
  button:{margin: 12,},
  dtpicker:{marginTop: 5,marginLeft: 20,width:100}
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
    bSelAll:false,
    };
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  toggleSelAll(evt, checked) {
    let pics = this.state.pics;
    for(const p in pics){
      pics[p].bsel = checked;
    }
    this.setState({pics:pics});
    this.setState({bSelAll:checked});
  }
  toggleSel(pos) {
    let pics = this.state.pics;
    let pic = pics[pos];
    pic.bsel = !pic.bsel;
    this.setState({pics:pics});
    this.setState({bSelAll:true});
    for(const p in pics){
      if(!pics[p].bsel){
       this.setState({bSelAll:false});
        break;
      }
    }
  }
  
  getTasks() {
    let pics = this.state.pics;
    return pics;
  }
 
  renderTasks() {
    return this.getTasks().map((task,i) => (
      <Task key={task._id} task={task} bsel={task.bsel} par={this} pos={i}/>
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
            checked={this.state.bSelAll}
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