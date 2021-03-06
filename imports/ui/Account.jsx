import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Accounts } from 'meteor/accounts-base'
import Subheader from 'material-ui/Subheader';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500} from 'material-ui/styles/colors';

const settings = require('../../settings.js');

const styles = {
  customContentStyle: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    float: 'left',
    marginRight: 40,
  },
};

const info ={
  'User not found':'不存在该用户',
  'Incorrect password':'密码错误',
  'Username already exists.':'该用户已经存在.',
  'Token expired':'链接失效'
}

const ERR_NULL_PWD = '密码不允许为空';

function _info(msg){
  return info[msg] || msg;
}

// Paint component - represents a single todo item
export default class Account extends Component {
  constructor(props) {
    super(props);
    let token = props.params.token;
    let open = token?2:0;
    this.state = {
      bLoading:false,
      open: open,
      err_join:'',
      err_login:'',
      val_email0:'',
      val_email1:'',
      val_pwd0:'',
      val_pwd1:'',
      val_pwd2:'',
      val_pwd3:'',
      val_pwd4:'',
      //err_email0:'用户邮箱必填',
      err_email0:'',

      err_pwd0:ERR_NULL_PWD,
      err_pwd1:ERR_NULL_PWD,
      err_pwd2:ERR_NULL_PWD,
      err_pwd3:ERR_NULL_PWD,
      err_pwd4:ERR_NULL_PWD,
      token:token,
    };
  }
  handleReset(e){
    this.setState({bLoading:true,err_reset:''});
    Accounts.resetPassword(this.state.token, this.state.val_pwd3, (err) => {
      if (err) {
        this.setState({
          err_reset: _info(err.reason),
          bLoading:false
        });
      } else {
         this.setState({
          err_reset: '密码修改成功',
          bLoading:false
        });
      }
    });
  }

  handleFogotPwd(e){
    this.setState({bLoading:true,err_login:''});
    Accounts.forgotPassword({email: this.state.val_email0}, (err) => {
      if (err) {
        this.setState({
          err_login: err.reason,
          bLoading:false
        });
      } else {
         this.setState({
          err_login: '重置密码的链接已经发送到您的邮箱',
          bLoading:false
        });
      }
    });
  }
  handleJoin(e){
    e.preventDefault();
    this.setState({bLoading:true,err_join:''});
    let email = this.state.val_email1;
    let name = email;
    let password = this.state.val_pwd1;
    Accounts.createUser({email: email, username: name, password: password}, (err) => {
      if(err){
        this.setState({
          err_join: _info(err.reason),
          bLoading:false
        });
      } else {
        //browserHistory.push('/login');
        this.setState({open:0,val_email0:email,err_email0:'',
          bLoading:false});
      }
    });
  }
  handleLogin(e){
    e.preventDefault();
    this.setState({bLoading:true,err_login:''});
    let email = this.state.val_email0;
    let password = this.state.val_pwd0;
    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        this.setState({
          err_login: _info(err.reason),
          bLoading:false
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
        disabled={this.state.err_email0 !=''}
        primary={true}
        onTouchTap={e => {this.handleFogotPwd({});}}
      />,       
      <FlatButton
        label="确定登录"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.err_email0 !='' || this.state.err_pwd0!=''}
        onTouchTap={this.handleLogin.bind(this)}
      />,
    ];
   if(settings.bRegister){
    actions_signin.push(
      <FlatButton
        label="我要注册"
        disabled={settings.canRegister}
        primary={true}
        onTouchTap={e => {this.setState({open:1});}}
      />
   );
   }
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

    const actions_reset = [
      <FlatButton
        label="回到登录"
        primary={true}
        onTouchTap={e => {
          this.setState({open:0});
        }}
      />,
      <FlatButton
        label="确定修改"
        primary={true}
        keyboardFocused={true}
        disabled={this.state.err_pwd3 !='' || this.state.err_pwd4 !='' }
        onTouchTap={this.handleReset.bind(this)}
      />,
    ];

    return (
    <div>
      <Dialog
          contentStyle={styles.customContentStyle}
          title="登录"
          actions={actions_signin}
          modal={false}
          open={this.state.open==0}
          onRequestClose={this.handleClose.bind(this)}
        >
{ this.state.bLoading && this.state.open==0?        
    <RefreshIndicator
      size={40}
      left={10}
      top={0}
      status="loading"
      style={styles.refresh}
    />:''
}
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
          contentStyle={styles.customContentStyle}
          title="注册"
          actions={actions_join}
          modal={false}
          open={this.state.open==1}
          onRequestClose={this.handleClose.bind(this)}
        >
{ this.state.bLoading && this.state.open==1?        
    <RefreshIndicator
      size={40}
      left={10}
      top={0}
      status="loading"
      style={styles.refresh}
    />:''
}
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
 

      <Dialog
          contentStyle={styles.customContentStyle}
          title="修改密码"
          actions={actions_reset}
          modal={false}
          open={this.state.open==2}
          onRequestClose={this.handleClose.bind(this)}
        >
{ this.state.bLoading && this.state.open==2?        
    <RefreshIndicator
      size={40}
      left={10}
      top={0}
      status="loading"
      style={styles.refresh}
    />:''
}
         <Subheader style={{color: red500}}>{this.state.err_reset}</Subheader>

        <TextField
          fullWidth={true}
          hintText="请输入您的新密码"
          floatingLabelText="用户密码"
          type="password"
          errorText={this.state.err_pwd3}
          value={this.state.val_pwd3}
          onChange={e => {
            var val = e.target.value;
            if(val=='')             
              this.setState({val_pwd3:val,err_pwd3:ERR_NULL_PWD});
            else
              this.setState({val_pwd3:val,err_pwd3:''});
          }}
        />
        <TextField
          fullWidth={true}
          hintText="再次输入密码"
          floatingLabelText="密码确认"
          type="password"
          errorText={this.state.err_pwd4}
          value={this.state.val_pwd4}
          onChange={e => {
            var val = e.target.value;
            let err ='';
            if(val==''){
              err = ERR_NULL_PWD;
            }else if(val!=this.state.val_pwd3){
              err = '密码不一致';
            }
            this.setState({val_pwd4:val,err_pwd4:err});
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