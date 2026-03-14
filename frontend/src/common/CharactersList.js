import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import UndecoratedLink from "./UndecoratedLink";
import ListItemSecondaryAction
  from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import List from "@material-ui/core/List/List";

const styles = (theme) => {

};

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class CharactersList extends React.Component {
  render() {
    const {characters, use_by} = this.props;

    return (
      <List>
        {characters.map(character =>
          (<div key={`player-character-${character.id}`}>
            <ListItem key={character.id}>
              <Avatar>
                <Person />
              </Avatar>
              <ListItemText primary={character.name}
                            secondary={(
                              <span>
                                {(use_by === undefined || use_by === true) && (
                                  <span>
                                    Played by <UndecoratedLink to={`/profiles/${character.owner}/`}>{character.owner_name}</UndecoratedLink> |&nbsp;
                                  </span>)}
                                {character.race} | {character.pc_class} {character.level} {character.faction !== null ? '|' : ''} {character.faction}
                              </span>
                            )}>
              </ListItemText>
              {character.owner === this.props.portalStore.currentUser.profileID && (
                <ListItemSecondaryAction>
                  <UndecoratedLink to={`/characters/${character.id}/edit`}>
                    <IconButton aria-label="See character">
                      <ChevronRightIcon />
                    </IconButton>
                  </UndecoratedLink>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </div>)
        )}
        </List>
    )
  }
}

export default CharactersList;
