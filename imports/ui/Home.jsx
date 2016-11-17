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
  componentDidMount() {
    ginf.app = null;
    document.title='功能导览';
  }
  
  render() {
    //选中增加阴影深度以示区别  
    return (
        <div id="home_nner">
            <Link to='/admin'>
            <Paper  zDepth={2} circle={true} >
                <CheckIcon style={styles.largeIcon} color={grey500} hoverColor={grey900} />
            </Paper>
            </Link>
            <Link to='/shoot'>
            <Paper  zDepth={2} circle={true} >
                <CameraIcon style={styles.largeIcon}  color={grey500} hoverColor={grey900} />
            </Paper>
            </Link>
            <Paper  zDepth={2} circle={true} >
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