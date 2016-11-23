import React, { Component } from 'react';
const settings = require('../../settings.js');
/*---upload conponent-----*/
var Dropzone = require('react-dropzone');

export default class Upload extends Component {
 constructor(props) {
    super(props); 
    this.state = {
      files: [],
    };
  }

    onDrop (acceptedFiles) {
      let xhr = new XMLHttpRequest(); 
      xhr.open('POST', '/'+settings.pic_upload, true);
      let me = this;
      me.setState({
        output:'正在上传'+acceptedFiles.length+'张图,请稍后...',
        files:[]
      });
      let pos =0;
      let items=[]

      let file = acceptedFiles[pos];
      xhr.onload = function(event){
        //console.log('onload');
        pos++;
        me.setState({
          files: acceptedFiles.slice(0,pos),
          output:'上传了'+pos+'/'+acceptedFiles.length+'张图'
        });
        if(pos<acceptedFiles.length){
          setTimeout(function(){
            file = acceptedFiles[pos];
            xhr.open('POST', '/'+settings.pic_upload, true);
            xhr.send(file);
          },200);
        }else{
            //多张图上传完毕
          me.setState({
            files: acceptedFiles,
            output:'上传了'+acceptedFiles.length+'张图'
          });
        }
      }

      xhr.send(file); 
    }

    onOpenClick() {
      this.dropzone.open();
    }

    render() {
    let w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
    //w -= 20;
    //屏幕宽度小于抽点图片尺寸,则强制图片与屏幕等宽
    let img_w = w < 450 ? w: 450;
      
        return (
            <div>
                <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop.bind(this)}>
                    <div>将上传的图片拽到此处，<br/>或者点击此处选择图片</div>
                </Dropzone>
                {this.state.files.length > 0 ? <div>
                <h2>{this.state.output}</h2>
                <div>{this.state.files.map((file,index) => <img width={img_w} key={index} src={file.preview} /> )}</div>
                </div> : null}
            </div>
        );
    }
}
