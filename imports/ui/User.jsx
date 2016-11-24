import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 

// Paint component - represents a single todo item
export default class User extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      open: 0,
    };
  }
  handleOpen() {
    this.setState({open: true});
  };

  handleClose (){
    this.setState({open: 1});
  }

  render() {
    const actions = [
      <FlatButton
        label="我要注册"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="确定登录"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];

    return (
      <div>
        <Dialog
          title="登录"
          actions={actions}
          modal={false}
          open={this.state.open==0}
          onRequestClose={this.handleClose.bind(this)}
        >
        <TextField
          hintText="请输入您的email作为用户名"
          floatingLabelText="用户邮箱"
          errorText="This field is required"
        />
        <TextField
          hintText="请输入您在本系统的密码"
          floatingLabelText="用户密码"
          type="password"
        />
        </Dialog>

        <Dialog
          title="注册"
          actions={actions}
          modal={false}
          open={this.state.open==1}
          onRequestClose={this.handleClose.bind(this)}
        >
        <TextField
          hintText="请输入您的email作为用户名"
          floatingLabelText="用户邮箱"
          errorText="This field is required"
        />
        <TextField
          hintText="请输入您在本系统的密码"
          floatingLabelText="用户密码"
          type="password"
        />
        </Dialog>
        
      </div>
    );
  }  
  
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }

}
 

User.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};