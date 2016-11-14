import React, { Component, PropTypes } from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
 
const settings = require('../../settings.js');

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};


// Paint component - represents a single todo item
export default class Shoot extends Component {
  constructor(props) {
    super(props);
    this.state = { pics: [],path:'upload'};
    let me = this;
    Meteor.call('folder.getpics', this.state.path, function(error, result){
        if(error){
            console.log(error);
        } else {
            let pics=[];
            for(var i=0; i<result.length; i++){
              let imgsrc = 'http://'+settings.host+ ':'+settings.port_web
                +settings.pic_url+me.state.path+'/'+ result[i].fn.replace(/\\/g,'/');
              pics.push({img:imgsrc,title:result[i].fn,author:i});
            }
            me.setState({pics:pics});
        }
    });
    
  }
  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  renderPics(){
    return this.state.pics.map((tile,i) => (
      <GridTile
          key={tile.img}
          title={tile.title}
          subtitle={<span>by <b>{tile.author}</b></span>}
          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
        >
          <img src={tile.img} />
        </GridTile>
    ));    
  }
  render() {
     return (
      <div style={styles.root}>
    <GridList
      cols={1}
      cellHeight={700}
      style={styles.gridList}
      padding={2}
    >
      {this.state.pics.map((tile) => (
        <GridTile
          key={tile.img}
          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
        >
          <img src={tile.img} />
        </GridTile>
      ))}
    </GridList>
  </div>   
    );
  }
}
 
Shoot.propTypes = {
};

Shoot.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};