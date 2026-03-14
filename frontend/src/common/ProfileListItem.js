import React, {Component, Fragment} from 'react';
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import Person from "@material-ui/icons/Person";
import {Link} from "react-router-dom";

class ProfileListItem extends Component {
  getName = (profile) => {
    const names = `${profile.first_name} ${profile.last_name}`;
    const nickname = profile.nickname ? ` (${profile.nickname})` : '';
    return names+nickname
  };

  render() {
    const {profile, action=null, character=null} = this.props;

    return (
      <ListItem button
                component={Link}
                to={`/profiles/${profile.id}`}
      >
        <Avatar>
          <Person />
        </Avatar>
        <ListItemText primary={this.getName(profile)}
                      secondary={(
                        <Fragment>
                          {character && (
                            <Fragment>
                              <strong>Playing: {character.name}, {character.pc_class} {character.level}</strong><br/>
                            </Fragment>
                          )}
                        {profile.role} | {profile.characters_count} character{profile.characters_count !== 1 ? 's' : ''}
                        </Fragment>
                      )} />
        {action && (
          <ListItemSecondaryAction>
            {action}
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }
}

export default ProfileListItem;
