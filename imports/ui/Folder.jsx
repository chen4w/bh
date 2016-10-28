
import React, { Component, PropTypes } from 'react';

import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';


// Task component - represents a single todo item
export default class Folder extends Component {
  constructor(props) {
    super(props);
    const me=this;
    Meteor.call('folder.list', '中文次2222',function(error, result){
        if(error){
            console.log(error);
        } else {
            console.log(result);
            me.setState({fl:result});
        }
    });
 
    this.state = {
        fl:[]
    };
  }
  onExpand(p1,p2){
      console.log('expand',this);
  }
  renderItem(){
    const iconButtonElement = (
        <IconButton
            touch={true}
            tooltip="more"
            tooltipPosition="bottom-left"
            onTouchTap={this.onExpand.bind(this,item)}
            >
            <MoreVertIcon color={grey400} />
        </IconButton>
    );
   return this.state.fl.map((item,i) => (
      <ListItem primaryText={item} 
        nestedItems={[]}
        rightIconButton={iconButtonElement}
        leftAvatar={<Avatar icon={<FileFolder />} />}
      key={i} />
    ));
  }

  render() {
    return (
          <List>
            <Subheader>请选择文件目录</Subheader>
            {this.renderItem()}
            <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
            <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
            <ListItem
              primaryText="Inbox"
              leftIcon={<ContentInbox />}
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText="Starred"
                  leftIcon={<ActionGrade />}
                />,
                <ListItem
                  key={2}
                  primaryText="Sent Mail"
                  leftIcon={<ContentSend />}
                  disabled={true}
                  nestedItems={[
                    <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                  ]}
                />,
                <ListItem
                  key={3}
                  primaryText="Inbox"
                  leftIcon={<ContentInbox />}
                  open={this.state.open}
                  onNestedListToggle={this.handleNestedListToggle}
                  nestedItems={[
                    <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
                  ]}
                />,
              ]}
            />
          </List>      
    );
  }
}
 
