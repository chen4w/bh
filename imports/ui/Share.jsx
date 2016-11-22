
import React, { Component, PropTypes } from 'react';
import ShareButtons from './ShareButtons.jsx';
const Masonry = require('react-masonry-component');

const settings = require('../../settings.js');

const masonryOptions = {
    transitionDuration: 0
};
export default class Share extends React.Component {
  constructor(props) {
    super(props);
    let me = this;
    this.state = {path:'upload',pics:[],bShowBtn:false};
    Meteor.call('folder.getpics', this.state.path, function(error, result){
        if(error){
            console.log(error);
        } else {
            //console.log('----正在请求图片：'+result);
            me.setState({pics:result,sb_open:true,
              sb_msg:'当前目录共'+result.length+'张图'});
            //console.log('--请求结束--'+result);
        }
    });
  }
handleClick(p1,p2){
    if(this.state.bShowBtn){
        this.setState({bShowBtn:false});
    }else if(p1.target.tagName=='IMG'){
        this.setState({bShowBtn:true});
    }
}

render() {
    let btn_el = '';
    if(this.state.bShowBtn){
        btn_el = 
    <ShareButtons 
        sites = {["qzone", "weibo", "qq", "tencent", "wechat", "douban" ]}
        url = "https://github.com/DawnyWu/react-share-buttons"
        title = "react-share-buttons"
        description = "一键分享到各大社交网站的react组件"
    />    
    }
    let w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
    w -= 20;
    //屏幕宽度小于抽点图片尺寸,则强制图片与屏幕等宽
    let img_w = w < 450 ? w: 450;
    let path_imgsrc = settings.url_root+ this.state.path.replace(/\\/g,'/')  +'/';
    if(settings.thumbnails_size>0)
      path_imgsrc+= settings.thumbnails_uri+settings.thumbnails_size +'/';
    
    var childElements = this.state.pics.map(function(pic,index){
        return (
          <div className="effect2" key={index} >
                <img width={img_w} src={path_imgsrc+pic.fn} />
          </div>
        );
    });

    return (
    <div>
        <Masonry
            onClick={this.handleClick.bind(this)}
            className={''} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
            {childElements}
        </Masonry>

        {btn_el}
        
    </div>
    );
  }
}
