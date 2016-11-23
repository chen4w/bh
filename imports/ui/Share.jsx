
import React, { Component, PropTypes } from 'react';
import ShareButtons from './ShareButtons.jsx';
import InfiniteScroll from 'react-infinite-scroller';

const Masonry = require('react-masonry-component');

const settings = require('../../settings.js');

const masonryOptions = {
    transitionDuration: 0
};
export default class Share extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.params.fpath);
    let fpath = this.props.params.fpath;
    if(fpath){
        fpath = settings.pic_archive+'/'+fpath+'/p';
    }else{
        //默认显示墙纸目录
        fpath = settings.pic_wallpaper;
    }
    let me = this;
    this.state = {
        path:fpath,
        pics:[],
        bShowBtn:false,
        hasMore:false,
        items:[],
    };
    Meteor.call('folder.getpics', this.state.path, function(error, result){
        if(error){
            console.log(error);
        } else {
            //console.log('----正在请求图片：'+result);
            me.setState({
                pics:result,
                sb_open:true,
                hasMore:true,
              sb_msg:'当前目录共'+result.length+'张图'});
            //console.log('--请求结束--'+result);
        }
    });
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
    console.log('load');
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
        title='我在杭州工艺美术博物馆的涂鸦' 
        sites = {["qzone", "weibo", "qq", "tencent", "wechat", "douban" ]}
        description = "即兴创作，一起来玩"
        image={this.state.imgsrc}
    />    
    }

    return (
    <div>
    <InfiniteScroll
    pageStart={0}
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
            {this.state.items}
        </Masonry>
    </InfiniteScroll>
        {btn_el}
        
    </div>
    );
  }
}