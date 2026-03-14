import React, {Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UndecoratedLink from "./UndecoratedLink";
import {inject, observer} from "mobx-react";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Divider from "@material-ui/core/Divider/Divider";

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGhost, faUserShield, faUser, faHome,
  faCalendar, faArchive, faIdCard,
  faUserCircle, faUserPlus, faFile
} from '@fortawesome/free-solid-svg-icons'

library.add(faGhost);
library.add(faUser);
library.add(faHome);
library.add(faUserShield);
library.add(faCalendar);
library.add(faArchive);
library.add(faIdCard);
library.add(faUserCircle);
library.add(faUserPlus);
library.add(faFile);


const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  link: {
    textDecoration: 'none',
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class SidebarNavigationList extends React.Component{

  currentProfile(){
    return this.props.portalStore.currentUser;
  }

  isAuth(){
    return this.props.portalStore.signed;
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <List component="nav">
          <UndecoratedLink to="/">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="home" />
              </ListItemIcon>
              <ListItemText primary="Homepage">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          {!this.isAuth() && (
            <Hidden smUp>
              <UndecoratedLink to="/register">
                <ListItem button>
                  <ListItemIcon>
                    <FontAwesomeIcon icon="user-circle" />
                  </ListItemIcon>
                  <ListItemText primary="Register"/>
                </ListItem>
              </UndecoratedLink>
              <UndecoratedLink to="/login">
                <ListItem button>
                  <ListItemIcon>
                    <FontAwesomeIcon icon="user-circle" />
                  </ListItemIcon>
                  <ListItemText primary="Login"/>
                </ListItem>
              </UndecoratedLink>
            </Hidden>
          )}
          <Divider />
          <UndecoratedLink to="/poradnik-pierwsza-sesja">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="file" />
              </ListItemIcon>
              <ListItemText primary="Poradnik: Twoja pierwsza sesja">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <ListItem button onClick={() => window.open('https://zasady.rpgkrakow.pl')}>
            <ListItemIcon className={classes.communityIcon}>
              <FontAwesomeIcon icon={["far","file"]} />
            </ListItemIcon>
            <ListItemText primary="Zasady OPK">
            </ListItemText>
          </ListItem>
          <ListItem button onClick={() => window.open('https://zasady.rpgkrakow.pl/content_catalog.html')}>
            <ListItemIcon className={classes.communityIcon}>
              <FontAwesomeIcon icon={["far","file"]} />
            </ListItemIcon>
            <ListItemText primary="Katalog przygód">
            </ListItemText>
          </ListItem>
          <Divider />
          {this.isAuth() && (
            <Fragment>
              <UndecoratedLink to={`/profiles/${this.currentProfile().profileID}`}>
                <ListItem button>
                  <ListItemIcon>
                    <FontAwesomeIcon icon="user-circle" />
                  </ListItemIcon>
                  <ListItemText primary="Your profile">
                  </ListItemText>
                </ListItem>
              </UndecoratedLink>
              <Hidden smUp>
                <UndecoratedLink to={`/characters/create`}>
                  <ListItem button>
                    <ListItemIcon>
                      <FontAwesomeIcon icon="user-plus" />
                    </ListItemIcon>
                    <ListItemText primary="Add new character">
                    </ListItemText>
                  </ListItem>
                </UndecoratedLink>
              </Hidden>
            </Fragment>
          )}
          <UndecoratedLink to="/games">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="calendar" />
              </ListItemIcon>
              <ListItemText primary="Next Game sessions">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/games/archive">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="archive" />
              </ListItemIcon>
              <ListItemText primary="Games Archive">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <Divider />
          <UndecoratedLink to="/profiles">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="user" />
              </ListItemIcon>
              <ListItemText primary="League Players">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <UndecoratedLink to="/characters">
            <ListItem button>
              <ListItemIcon>
                <FontAwesomeIcon icon="id-card" />
              </ListItemIcon>
              <ListItemText primary="Characters">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
          <Divider/>
          <UndecoratedLink to="/terms">
            <ListItem button>
              <ListItemIcon className={classes.communityIcon}>
                <FontAwesomeIcon icon={["far","file"]} />
              </ListItemIcon>
              <ListItemText primary="Terms &amp; Conditions">
              </ListItemText>
            </ListItem>
          </UndecoratedLink>
        </List>
      </div>
    );
  }
}

export default SidebarNavigationList;
