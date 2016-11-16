import React, { Component, PropTypes } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'
import Paper from 'material-ui/Paper';
import CameraIcon from 'material-ui/svg-icons/image/photo-camera';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import ShareIcon from 'material-ui/svg-icons/social/share';

import {grey900, grey500} from 'material-ui/styles/colors';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {

    inner: {
        //backgroundColor: 'yellow',
        position:'absolute',
        left:'50%',
        top:'50%',
        margin: '-80px 0 0 -240px'
    },    
    btn:{
        height: 120,
        width: 120,
        margin: 20,
        textAlign: 'center',
        display: 'inline-block',
    },
    largeIcon: {
        width: 90,
        height: 90,
        padding: 15
  },
}

export default class Home extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
    };
  }

  getChildContext() {
     return { muiTheme: getMuiTheme(baseTheme) };
  }
  
  render() {
    //选中增加阴影深度以示区别  
    return (
        <div style={styles.inner}>
            <Link to='/admin'>
            <Paper style={styles.btn} zDepth={2} circle={true} >
                <CheckIcon style={styles.largeIcon} color={grey500} hoverColor={grey900} />
            </Paper>
            </Link>
            <Link to='/shoot'>
            <Paper style={styles.btn} zDepth={2} circle={true} >
                <CameraIcon style={styles.largeIcon}  color={grey500} hoverColor={grey900} />
            </Paper>
            </Link>
            <Paper style={styles.btn} zDepth={2} circle={true} >
                <ShareIcon style={styles.largeIcon} color={grey500} hoverColor={grey900} />
            </Paper>
        </div>      
    );
  }
}
 
Home.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
};

Home.childContextTypes = {
   muiTheme: React.PropTypes.object.isRequired,
};