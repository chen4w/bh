import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Accounts } from 'meteor/accounts-base'
import Subheader from 'material-ui/Subheader';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500} from 'material-ui/styles/colors';

 
const customContentStyle = {
  width: '100%',
  maxWidth: 500,
};
const ERR_NULL_PWD = '密码不允许为空';
// Paint component - represents a single todo item
export default class Account extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      open: 0,
      err_join:'',
      err_login:'',
      val_email0:'',
      val_email1:'',
      val_pwd0:'',
      err_pwd0:ERR_NULL_PWD,
      val_pwd1:'',
      err_pwd1:ERR_NULL_PWD,
      err_pwd2:ERR_NULL_PWD,
    };
  }
  handleJoin(e){
    e.preventDefault();
    let email = this.state.val_email1;
    let name = email;
    let password = this.state.val_pwd1;
    Accounts.createUser({email: email, username: name, password: password}, (err) => {
      if(err){
        this.setState({
          err_join: err.reason
        });
      } else {
        //browserHistory.push('/login');
        this.setState({open:0,val_email0:email,err_email0:''});
      }
    });
  }
  handleLogin(e){
    e.preventDefault();
    let email = this.state.val_email0;
    let password = this.state.val_pwd0;
    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        this.setState({
          err_login: err.reason
        });
      } else {
        browserHistory.push('/');
      }
    });
  }

  handleClose (){
    this.setState({open: 1});
  }
  validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  render() {
    const actions_signin = [
      <FlatButton
        label="密码忘了"
        primary={true}
        onTouchTap={e => {this.setState({open:1});}}
      />,
      <FlatButton
        label="我要注册"
        primary={true}
        onTouchTap={e => {this.setState({open:1});}}
      />,
      <FlatButton
        label="确定登录"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.err_email0 !='' || this.state.err_pwd0!=''}
        onTouchTap={this.handleLogin.bind(this)}
      />,
    ];
    const actions_join = [
      <FlatButton
        label="回到登录"
        primary={true}
        onTouchTap={e => {
          this.setState({open:0});
        }}
      />,
      <FlatButton
        label="确定注册"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.err_pwd2 !='' || this.state.err_pwd1 !='' || this.state.err_email1 !=''}
        onTouchTap={this.handleJoin.bind(this)}
      />,
    ];

    return (
    <div>
      <Dialog
          contentStyle={customContentStyle}
          title="登录"
          actions={actions_signin}
          modal={false}
          open={this.state.open==0}
          onRequestClose={this.handleClose.bind(this)}
        >
        <Subheader style={{color: red500}}>{this.state.err_login}</Subheader>
        <TextField
          fullWidth={true}
          hintText="请输入您的email作为用户名"
          floatingLabelText="用户邮箱"
          value={this.state.val_email0}
          errorText={this.state.err_email0}
          onChange={e => {
            var val = e.target.value;
            if(!this.validateEmail(val)){
              this.setState({
                val_email0: val ,
                err_email0:'请输入有效的email地址'
              });
            }else{
              this.setState({ 
                val_email0: val ,
                err_email0:''
              });
            }
        }}
        />
        <TextField
          fullWidth={true}
          hintText="请输入您在本系统的密码"
          floatingLabelText="用户密码"
          errorText={this.state.err_pwd0}          
          type="password"
          onChange={e => {
            var val = e.target.value;
            if(val=='')
              this.setState({val_pwd0:val,err_pwd0:ERR_NULL_PWD});
            else
              this.setState({val_pwd0:val,err_pwd0:''});
          }}
        />
      </Dialog>


      <Dialog
          contentStyle={customContentStyle}
          title="注册"
          actions={actions_join}
          modal={false}
          open={this.state.open==1}
          onRequestClose={this.handleClose.bind(this)}
        >
         <Subheader style={{color: red500}}>{this.state.err_join}</Subheader>
        <TextField
          fullWidth={true}
          hintText="请输入您的email作为用户名"
          floatingLabelText="用户邮箱"
          errorText={this.state.err_email1}
          value={this.state.val_email1}
          onChange={e => {
            var val = e.target.value;
            if(!this.validateEmail(val)){
              this.setState({
                val_email1: val ,
                err_email1:'请输入有效的email地址'
              });
            }else{
              this.setState({ 
                val_email1: val ,
                err_email1:''
              });
            }
        }}
        />
        <TextField
          fullWidth={true}
          hintText="请输入您在本系统的密码"
          floatingLabelText="用户密码"
          type="password"
          errorText={this.state.err_pwd1}
          value={this.state.val_pwd1}
          onChange={e => {
            var val = e.target.value;
            if(val=='')             
              this.setState({val_pwd1:val,err_pwd1:ERR_NULL_PWD});
            else
              this.setState({val_pwd1:val,err_pwd1:''});
          }}
        />
        <TextField
          fullWidth={true}
          hintText="再次输入密码"
          floatingLabelText="密码确认"
          type="password"
          errorText={this.state.err_pwd2}
          value={this.state.val_pwd2}
          onChange={e => {
            var val = e.target.value;
            let err ='';
            if(val==''){
              err = ERR_NULL_PWD;
            }else if(val!=this.state.val_pwd1){
              err = '密码不一致';
            }
            this.setState({val_pwd2:val,err_pwd2:err});
          }}
        />
    </Dialog>
 

      </div>
    );
  }  
  
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }

}
 

Account.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};