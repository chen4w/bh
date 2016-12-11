import React, { Component } from 'react';
import { browserHistory } from 'react-router';
 
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import RotateIcon from 'material-ui/svg-icons/device/screen-rotation';
import RotateLeftIcon from 'material-ui/svg-icons/image/rotate-left';
import RotateRightIcon from 'material-ui/svg-icons/image/rotate-right';

//import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import RefreshIndicator from 'material-ui/RefreshIndicator';


import Paint from './Paint.jsx';
import Folder from './Folder.jsx';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const settings = require('../../settings.js');

const  MobileDetect = require('mobile-detect'),
    mdd = new MobileDetect(navigator.userAgent),
    bMobile = mdd.mobile();

const styles = {
  refresh: {
    position: 'fixed',
    left: '50%',
    top:'50%',
  },
  customWidth: {
    width: 100,
  },
  toolbar:{
    position: 'fixed',
    top: 0,
    width: '100%',
    height:45,
  },
  checkbox: {
    marginTop: 12,
    marginBottom: 17,
    marginLeft: 12,
    width: 80
   },
  label: {
    marginTop: 20,
  },
  label_check:{
    whiteSpace: "nowrap"
  },
  button:{margin: 12,},
  btn_ico:{marginTop: 8, marginRight:22},
  auto_complete:{marginTop: 0,marginLeft: 20,width:180}
}; 
// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);

    //console.log(this.props);
    let path_default = props.params.path?props.params.path:'upload';
    this.state = {
      path_root:path_default,
      path:path_default,
      path_sel:'',
      pics: [],
      bSelAll:false,
      dt_default:new Date(),
      openDelete:false,
      openLogout:false,
      sels:[],
      folders:[],
      sb_open:true,
      sb_msg:'正在请求图片...',
      bLoading:false,
      isAuthenticated: Meteor.userId() !== null
    };

    this.initSock();    

    var me=this;
    this.onDirChange(this.state.path_sel);
  }

  initSock(){
    /*--------websocket----------*/
    let socket = require('socket.io-client')('http://'+settings.host+':'+settings.port_sock);
    let me = this;
    socket.on('connect', function() {
      console.log('Client connected');
    });
    socket.on('disconnect', function() {
      console.log('Client disconnected');
    });
    socket.on('added', function(data) {
      console.log('added:'+data);
      me.onItemAdded(data);
    });
    socket.on('deleted', function(data) {
      console.log('deleted:'+data);
      me.onItemDeleted(data);
    });
    socket.on('change', function(data) {
      console.log('change:'+data);
      me.onItemChange(data);
    });
    /*---------websocket end--------*/
  }
  handleSBClose(){
    this.setState({sb_open:false,sb_msg:''});
  }
//登录验证
  componentWillMount(){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    }
  }

  componentDidMount() {
    document.title='合规检查';
  }
  logout(){
    Meteor.logout(e =>  browserHistory.push('/login'));   
  }
  getPicLen(){
    if(!bMobile || !settings.show_limit)
      return this.state.pics.length;
    else
      return Math.min(this.state.pics.length,settings.show_limit);
  }
  onItemAdded(data){
    //console.log('新加入图片：'+data);   
    let pics = this.state.pics;
    let plen = this.state.path.length;

    for(var k=0; k<data.length; k++){
      let dk = data[k];
      let ldk = dk.toLowerCase();
      //忽略抽点推送的抽点文件,忽略待处理目录下的/p /n 目录
      let fn = dk.substring(plen+1);
      if(dk.indexOf(this.state.path)!=0 
        ||fn.indexOf('/')!=-1 ||
        (!ldk.endsWith('.jpg')&& !ldk.endsWith('.png')&& !ldk.endsWith('.jpeg')))
        continue;
      pics.push({fn:fn});
    }   
    this.setState({sb_open:true,sb_msg:'新加入图片：'+data,pics:pics});
  }
//图片被修改
  onItemChange(data){
    //当前目录
    let pics = this.state.pics;
    let sels = this.state.sels;
    let plen = this.state.path.length;
    let bsel = false;
    for(var k=0; k<data.length; k++){
      let dk = data[k];
      let fn = dk.substring(plen+1);
      if(dk.indexOf(this.state.path)!=0 
        ||fn.indexOf('/')!=-1 )
        continue;
      //remove paper
      for(var i=0; i<pics.length; i++){
        if(pics[i].fn==fn){
          //pics.splice(i,1);
          //find the component and forceUpdate it
          pics[i].tm = new Date().getTime();
          break;
        }
      } 
      //update from selected 是否本人操作结果,是则结束等待图标
      for(var i=0; i<sels.length; i++){
        if(sels[i].fn==fn){
          //sels.splice(i,1);
          bsel = true;
          break;
        }
      }       
    }   
    //如果删除的是本人选中的，判定操作已完成，隐藏Loading图标
    let ns = {pics:pics,sb_open:true,sb_msg:'修改图片：'+data};
    if(bsel){
      ns.bLoading = false;
    }
    this.setState(ns);
  }

  onItemDeleted(data){
    //当前目录
    let pics = this.state.pics;
    let sels = this.state.sels;
    let plen = this.state.path.length;
    let bsel = false;
    for(var k=0; k<data.length; k++){
      let dk = data[k];
      let fn = dk.substring(plen+1);
      if(dk.indexOf(this.state.path)!=0 
        ||fn.indexOf('/')!=-1 )
        continue;
      //remove paper
      for(var i=0; i<pics.length; i++){
        if(pics[i].fn==fn){
          pics.splice(i,1);
          break;
        }
      } 
      //remove from selected,是否本人操作结果,是则结束等待图标
      for(var i=0; i<sels.length; i++){
        if(sels[i].fn==fn){
          sels.splice(i,1);
          bsel = true;
          break;
        }
      }       
    }   
    //如果删除的是本人选中的，判定操作已完成，隐藏Loading图标
    let ns = {pics:pics,sb_open:true,sb_msg:'移除图片：'+data};
    if(bsel){
      ns.bLoading = false;
      //ns.sels = sels;
      if(sels.length==0){
        ns.bSelAll=false;
      }
    }
    this.setState(ns);
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  onDirChange(p1){
    let me = this;
    let path = p1==''?this.state.path_root:this.state.path_root+'/'+ p1;
    Meteor.call('folder.getpics',path , function(error, result){
        if(error){
            console.log(error);
        } else {
            //console.log('----正在请求图片：'+result);
            me.setState({
              path:path,
              path_sel:p1,pics:result,sb_open:true,
              bSelAll:false,
              sels:[],
              sb_msg:'当前目录共'+result.length+'张图'});
            //console.log('--请求结束--'+result);
        }
    });
  }
  handleRotate(angle){
    this.setState({bLoading:true});
    let pics = [];
    let path = this.state.path+'/';
    this.state.sels.forEach(function (item, index, array) {
      pics.push(path+item.fn);
    });
   Meteor.call('pic.rotate',pics,angle, function(error, result){
        if(error){
            console.log(error);
        }
    });    
  }
  handleDeleteOpen(){
    this.setState({openDelete: true});
  }
  handleLogoutOpen(){
    this.setState({openLogout: true});
  }

  handlePass(p1, p2){
    //pass or noPass pics
    console.log(p1);
    let me = this;
    let pics = [];
    let path = this.state.path+'/';
    this.state.sels.forEach(function (item, index, array) {
      pics.push(path+item.fn);
    });
    me.setState({openDelete: false,bLoading:true});
    Meteor.call('pic.pass',pics,p1, function(error, result){
        if(error){
            console.log(error);
        }
    });    
  };
  
  toggleSelAll(evt, checked) {
     //evt.preventDefault();
    let pics = this.state.pics;
    let len = this.getPicLen();
    let sels=[];
    for(var i=0; i<len; i++){
      let pic = pics[i];
      pic.bsel = checked;
      sels.push(pic);
    }
    this.setState({
      bSelAll:checked,
      pics:pics,
      sels:(checked?sels:[])});
  }
  toggleSel(pos,evt) {
     evt.preventDefault();
    let pics = this.state.pics;
    let pic = pics[pos];
    let sels=[];
    pic.bsel = !pic.bsel;
    
    let bSelAll=true;
    let len = this.getPicLen();

    for(var i=0; i<len; i++){
      let pic = pics[i];
      if(!pic.bsel){
       bSelAll=false;
      }else{
        sels.push(pic);
      }
    }
    this.setState({
      bSelAll:bSelAll,
      sels:sels,
      pics:pics
    });
   }
   
  handleCloseDelete(){
    this.setState({openDelete: false});
  }
  handleCloseLogout(){
    this.setState({openLogout: false});
  }

  renderPaints() {
    //相对路径会导致ios设备无法获取到图片
    let path_imgsrc = settings.url_root+ this.state.path  +'/';
    if(settings.thumbnails_size>0)
      path_imgsrc+= settings.thumbnails_uri+settings.thumbnails_size +'/';
    //是否限制显示前n张,规避pad上的性能问题,pc显示全部
    //console.log('ismobile:'+mdd.mobile());
    let len = this.getPicLen();
    let result = [];
    for(var i=0; i<len; i++){
        let pic = this.state.pics[i];
        if(pic.tm){
          result.push( <Paint key={i} pic={path_imgsrc+pic.fn+'?tm='+pic.tm} bsel={pic.bsel} par={this} pos={i}/>);
        }else{
          result.push( <Paint key={i} pic={path_imgsrc+pic.fn} bsel={pic.bsel} par={this} pos={i}/>);
        }
    }
    return result;
  }
 
  render() {
     let bSelOne = this.state.sels.length>0?true:false;
     let check_label = this.state.sels.length +'/'+this.state.pics.length;
     const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleCloseDelete.bind(this)}
      />,
      <FlatButton
        label="删除"
        primary={true}
        onTouchTap={this.handlePass.bind(this,false)}
      />,
    ];

     const actions_logout = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleCloseLogout.bind(this)}
      />,
      <FlatButton
        label="退出"
        primary={true}
        onTouchTap={e => this.logout()}
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

        <Dialog
          actions={actions_logout}
          modal={false}
          open={this.state.openLogout}
          onRequestClose={this.handleCloseLogout.bind(this)}
        >
          确定要退出登录吗?
        </Dialog>
          

    <Toolbar style={styles.toolbar}>
        <ToolbarGroup firstChild={true}>
       <Checkbox
            label={check_label}
            checked={this.state.bSelAll}
            onCheck={this.toggleSelAll.bind(this)}
            style={styles.checkbox}
            labelStyle={styles.label_check}
          />
  
    <IconButton tooltip="通过"
      disabled={!bSelOne || this.state.path.endsWith('/p')}
      onTouchTap={e => this.handlePass(true)} >
      <CheckIcon />
    </IconButton>

    <IconButton tooltip="删除"
      disabled={!bSelOne}
      onTouchTap={e => this.handleDeleteOpen()} >
      <CloseIcon />
    </IconButton>

    <IconButton tooltip="左转"
      disabled={!bSelOne}
      onTouchTap={e => this.handleRotate(-90)} >
      <RotateLeftIcon />
    </IconButton>

    <IconButton tooltip="右转"
      disabled={!bSelOne}
      onTouchTap={e => this.handleRotate(90)} >
      <RotateRightIcon />
    </IconButton>

      </ToolbarGroup>

        <ToolbarGroup >

    <IconButton tooltip="退出登录"
      onTouchTap={e => this.handleLogoutOpen()} >
      <PowerIcon />
    </IconButton>

      <SelectField 
      value={this.state.path_sel}
      style={styles.customWidth}
      onChange={(e,p1,p2) => this.onDirChange(p2)}>
        <MenuItem value={''} primaryText="待检查" />
        <MenuItem value={'p'} primaryText="已通过" />
        <MenuItem value={'n'} primaryText="已删除" />
      </SelectField>

         </ToolbarGroup>
</Toolbar>

{ this.state.bLoading?
  <div style={styles.refresh}>
    <RefreshIndicator
      size={80}
      loadingColor="#FF9800"
      status="loading"
      top={-40}
      left={-40}
    />
  </div> :''
}

        <ul>
          {this.renderPaints()}
        </ul>
        <Snackbar
          open={this.state.sb_open}
          message={this.state.sb_msg}
          autoHideDuration={4000}
          onRequestClose={this.handleSBClose.bind(this)}
        />
      </div>
    );
  }
}

App.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};