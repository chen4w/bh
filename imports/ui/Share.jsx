
import React, { Component, PropTypes } from 'react';
import {  browserHistory } from 'react-router';

import {Toolbar} from 'material-ui/Toolbar';

import AutoComplete from 'material-ui/AutoComplete';
import ShareButtons from './ShareButtons.jsx';
import InfiniteScroll from 'react-infinite-scroller';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const Masonry = require('react-masonry-component');

const settings = require('../../settings.js');

const masonryOptions = {
    transitionDuration: 0
};
export default class Share extends React.Component {
  constructor(props) {
    super(props);
    //console.log(this.props.params.fpath);
    let fpath = this.props.params.fpath;
    if(!fpath){
        fpath = settings.pic_wallpaper;
    }
    let me = this;
    this.state = {
        path:settings.pic_archive + settings.path_sep+fpath,
        path_sel:fpath,
        path_root:settings.pic_archive,
        folders:[],
        pics:[],
        page:0,
        bShowBtn:false,
        hasMore:false,
        items:[],
    };
    Meteor.call('folder.listfolder', this.state.path_root, function(error, result){
        if(error){
            console.log(error);
        } else {
          //console.log(result);
            me.setState({folders:result});
        }
    });
    this.onDirChange(this.state.path_sel);
  }
  onDirChange(p1){
    let me = this;
    let path = this.state.path_root+settings.path_sep+ p1;
    Meteor.call('folder.getpics',path , function(error, result){
        if(error){
            console.log(error);
        } else {
         browserHistory.push('/share/'+p1.replace(/\\|\//g,'-'));
         me.setState({
            path:path,
            path_sel:p1,
            pics:result,
            hasMore:true,
            sb_open:true,
            //url:browserHistory.getCurrentLocation(),
            page:0,
            items:[],
            sb_msg:'当前目录共'+result.length+'张图'});
        }
    });
  }

getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
}
  
handleClick(p1,p2){
    if(this.state.bShowBtn){
        this.setState({bShowBtn:false,imgsrc:''});
    }else if(p1.target.tagName=='IMG'){
        this.setState({
            bShowBtn:true,
            imgsrc:p1.target.src
        });
    }
}
loadMore(page) {
    //console.log('load');
    let w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
    w -= 20;
    //屏幕宽度小于抽点图片尺寸,则强制图片与屏幕等宽
    let img_w = w < 450 ? w: 450;
    //share/2016-11-21/ 替换路径符号和-
    let path_imgsrc = settings.url_root+ this.state.path.replace(/\\|\-/g,'/')  +'/';
    if(settings.thumbnails_size>0)
      path_imgsrc+= settings.thumbnails_uri+settings.thumbnails_size +'/';
    
    let picPos = this.state.items.length;
    let picLen = this.state.pics.length;
    let len = Math.min(settings.share_limit,picLen-picPos);
    if(len==0){
        this.setState({hasMore:false});
        return;
    }
    let items = [];
    for(var i=0; i<len; i++){
        let pic = this.state.pics[i];
        items.push(
         <div className="effect2" key={i+picPos} >
                <img width={img_w} src={path_imgsrc+pic.fn} />
          </div>
        );
    }
    let me=this;
    setTimeout(function() {
        me.setState({
            items:me.state.items.concat(items),
            hasMore:true
        });
     }.bind(this), 100);
}
render() {
    let btn_el = '';
    if(this.state.bShowBtn){
        btn_el = 
    <ShareButtons
        url={location.href}
        title='我在杭州工艺美术博物馆的涂鸦' 
        sites = {["qzone", "weibo", "qq", "tencent", "wechat", "douban" ]}
        description = "即兴创作，一起来玩"
        image={this.state.imgsrc}
    />    
    }

    return (
    <div>
   <Toolbar style={{position: 'fixed',top: 0,width: '100%',zIndex:10,height:45}}>
        <AutoComplete
          style={{paddingLeft:10}}
          hintText="输入目录路径"
          dataSource={this.state.folders}
          searchText={this.state.path_sel}
          openOnFocus={true}
          onNewRequest={this.onDirChange.bind(this)}
          maxSearchResults={5}
          fullWidth={true}
        />
 </Toolbar>
    <InfiniteScroll
    pageStart={this.state.page}
    loadMore={this.loadMore.bind(this)}
    hasMore={this.state.hasMore}
    loader={<div className="loader">Loading ...</div>}>

        <Masonry
            onClick={this.handleClick.bind(this)}
            className={''} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
        <br/><br/>
            {this.state.items}
        </Masonry>
    </InfiniteScroll>
        {btn_el}
        
    </div>
    );
  }
}

Share.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};