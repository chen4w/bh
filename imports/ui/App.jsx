import React, { Component } from 'react';
 
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Chip from 'material-ui/Chip';

import Task from './Task.jsx';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 

const styles = {
  checkbox: {
    marginTop: 18,
    marginLeft: 12,
  },
  label: {
    marginTop: 20,
  },
  label_check:{
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
      dt_default:new Date(),
      openDelete:false,
      sels:[]
    };
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }

  handleDelete(){
    this.setState({openDelete: true});
  };
  
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
    let sels=[];
    pic.bsel = !pic.bsel;
    this.setState({pics:pics});
    
    let bSelAll=true;
    for(const p in pics){
      if(!pics[p].bsel){
       bSelAll=false;
      }else{
        sels.push(pics[p]);
      }
    }
    this.setState({bSelAll:bSelAll});
    this.setState({sels:sels});
  }
  
  getTasks() {
    let pics = this.state.pics;
    return pics;
  }
 
  handleCloseDelete(){
    this.setState({openDelete: false});
  };

  renderTasks() {
    return this.getTasks().map((task,i) => (
      <Task key={task._id} task={task} bsel={task.bsel} par={this} pos={i}/>
    ));
  }
 
  render() {
     let bSelOne = this.state.sels.length>0?true:false;
     const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleCloseDelete.bind(this)}
      />,
      <FlatButton
        label="删除"
        primary={true}
        onTouchTap={this.handleCloseDelete}
      />,
    ];

    return (
      <div id="container" className="container">
        <Dialog
            actions={actions}
            modal={false}
            open={this.state.openDelete}
            onRequestClose={this.handleCloseDelete.bind(this)}
          >
            确定删除选中的{this.state.sels.length}项？
          </Dialog>

    <Toolbar>
        <ToolbarGroup firstChild={true}>
         <DatePicker hintText="选择目录" 
          autoOk={true}
          defaultDate={this.state.dt_default}
          
          style={styles.dtpicker}
         />
        <label
         style={styles.label}
        >
          400张
        </label>

        
        </ToolbarGroup>

        <ToolbarGroup >
    <RaisedButton label="通过" primary={true} style={styles.button} disabled={!bSelOne}/>
    <RaisedButton label="删除" secondary={true} style={styles.button} disabled={!bSelOne}
      onTouchTap={this.handleDelete.bind(this)}/>        
        <ToolbarSeparator />
          <Checkbox
            label="全选"
            checked={this.state.bSelAll}
            onCheck={this.toggleSelAll.bind(this)}
            style={styles.checkbox}
            labelStyle={styles.label_check}
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