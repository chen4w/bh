import React, { Component } from 'react';
 
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CameraIcon from 'material-ui/svg-icons/image/photo-camera';

import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import Paint from './Paint.jsx';
import Folder from './Folder.jsx';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 
const styles = {
  toolbar:{
    position: 'fixed',
    top: 0,
    width: '100%'
  },
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
  auto_complete:{marginTop: 5,marginLeft: 20,width:200}
}; 
// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);


    this.state = {
      path:'upload',
      pics: [],
      bSelAll:false,
      dt_default:new Date(),
      openDelete:false,
      sels:[],
      openFolder:false,
      folders:[]
    };
    var me=this;
    Meteor.call('folder.listfolder', function(error, result){
        if(error){
            console.log(error);
        } else {
          //console.log(result);
            me.setState({folders:result});
        }
    });
    this.onDirChange(this.state.path);
  }

  takePic(){
        MeteorCamera.getPicture({  
          width: 800,
          height: 1600,
          quality: 75
        }, function (err, data) {
          if (err) {
            console.log('error', err);
          }
          if(data)
            Meteor.call('pic.take', data,'/upload');
    });    
  }
  onItemAdded(data){
    let pics = this.state.pics;
    for(var k=0; k<data.length; k++){
      let dk = data[k];
      let ldk = dk.toLowerCase();
      if(dk.indexOf(this.state.path)!=0 || 
        (!ldk.endsWith('.jpg')&& !ldk.endsWith('.png')&& !ldk.endsWith('.jpeg')))
        continue;
      let fn = dk.substring(this.state.path.length+1);
      pics.push({fn:fn});
    }   
    this.setState({pics:pics});
    console.log('pic added---'+data);   
  }
  onItemDeleted(data){
    //当前目录
    let pics = this.state.pics;
    let sels = this.state.sels;
    for(var k=0; k<data.length; k++){
      if(data[k].indexOf(this.state.path)!=0)
        continue;
      let fn = data[k].substring(this.state.path.length+1);
      //remove paper
      for(var i=0; i<pics.length; i++){
        if(pics[i].fn==fn){
          pics.splice(i,1);
          break;
        }
      } 
      //remove from selected
      for(var i=0; i<sels.length; i++){
        if(sels[i].fn==fn){
          sels.splice(i,1);
          break;
        }
      }       
    }   
    this.setState({pics:pics});
    console.log('pic deleted--'+data);
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  onDirChange(p1,p2){
    let me = this;
    Meteor.call('folder.getpics', p1, function(error, result){
        if(error){
            console.log(error);
        } else {
          console.log(p1+'----'+result);
            me.setState({path:p1});
            me.setState({pics:result});
        }
    });
  }
  handleFolder(){
    this.setState({openFolder:!this.state.openFolder});
  }
  handleDeleteOpen(){
    this.setState({openDelete: true});
  };

  handlePass(p1, p2){
    //pass or noPass pics
    console.log(p1);
    let me = this;
    let pics = [];
    let path = this.state.path+'/';
    this.state.sels.forEach(function (item, index, array) {
      pics.push(path+item.fn);
    });
    console.log(pics);
    Meteor.call('pic.pass',pics,p1, function(error, result){
        if(error){
            console.log(error);
        } else {
            console.log(result);
         }
         me.setState({openDelete: false});
    });    
  };
  
  toggleSelAll(evt, checked) {
    let pics = this.state.pics;
    for(const p in pics){
      pics[p].bsel = checked;
    }
    this.setState({pics:pics});
    this.setState({bSelAll:checked});
    if(checked)
      this.setState({sels:pics});
    else
      this.setState({sels:[]});
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
   
  handleCloseDelete(){
    this.setState({openDelete: false});
  };

  renderPaints() {
    let path = this.state.path+'/';
    return this.state.pics.map((pic,i) => (
      <Paint key={i} pic={path+pic.fn} bsel={pic.bsel} par={this} pos={i}/>
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
        onTouchTap={this.handlePass.bind(this,false)}
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

    <Toolbar style={styles.toolbar}>
        <ToolbarGroup firstChild={true}>
  
    <AutoComplete
      hintText="输入目录路径"
      filter={AutoComplete.fuzzyFilter}
      dataSource={this.state.folders}
      maxSearchResults={5}
      onNewRequest={this.onDirChange.bind(this)}
      searchText={this.state.path}
      style={styles.auto_complete}
    />
    
        <IconMenu
          style={styles.button}
          iconButtonElement={<IconButton><CameraIcon /></IconButton>}
        >
          <MenuItem  primaryText="拍照" onTouchTap={this.takePic.bind(this)}/>
          <MenuItem  primaryText="上传" />
        </IconMenu>

        </ToolbarGroup>

        <ToolbarGroup >
    <RaisedButton label="通过" primary={true} style={styles.button} disabled={!bSelOne}
    onTouchTap={this.handlePass.bind(this,true)} />
    <RaisedButton label="删除" secondary={true} style={styles.button} disabled={!bSelOne}
      onTouchTap={this.handleDeleteOpen.bind(this)}/>        
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
          {this.renderPaints()}
        </ul>
      </div>
    );
  }
}

App.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};