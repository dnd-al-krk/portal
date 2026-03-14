import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';

import opk_krakow_logo from '../images/opk_krakow_logo.png';

import SidebarNavigationList from "./SidebarNavigationList";
import Menu from "@material-ui/core/Menu/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {withRouter} from "react-router";
import Button from "@material-ui/core/Button/Button";
import Hidden from "@material-ui/core/Hidden/Hidden";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {

  },
  toolbar: {
    padding: 0,
    height: '48px',
    minHeight: '48px',
  },
  appBar: {
    backgroundColor: '#333',
    height: '48px',
    minHeight: '48px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    flexGrow: 1,
  },
  logo: {
    height: '45px',
    marginTop: '7px',
  },
  rightNav: {
    position: 'absolute',
    right: '15px',
  },
});


@withRouter
@inject('portalStore') @observer
class TopAppBar extends React.Component {
  state = {
    accountAnchorEl: null,
    drawerMenu: true,
  };

  handleMenu = element => event => {
    this.setState({ [element]: event.currentTarget });
  };

  handleClose = element => () => {
    this.setState({ [element]: null });
  };

  toggleDrawer = () => {
    this.props.portalStore.navigationStore.toggleDrawer();
  };

  logout = () => {
    this.setState({
      accountAnchorEl: null,
    });
    this.props.portalStore.fullSignOut();
    this.props.history.push('/');
  };

  isAuthenticated = () => {
    return this.props.portalStore.isAuthenticated();
  };

  gotoLogin = () => {
    this.setState({
      accountAnchorEl: null,
    });
    this.props.history.push('/login')
  };

  gotoRegister = () => {
    this.setState({
      accountAnchorEl: null,
    });
    this.props.history.push('/register')
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div>
        <SidebarNavigationList />
      </div>
    );

    const accountOpen = Boolean(this.state.accountAnchorEl);
    let profileID = false;
    if(!!this.isAuthenticated()){
      profileID = this.props.portalStore.currentUser.profileID;
    }


    return (
      <div className={classes.root}>
        <AppBar className={ classes.appBar }>
          <Toolbar className={ classes.toolbar }>

            <Hidden mdUp>
              <IconButton color="inherit" className={ classes.menuButton } aria-label="Menu"
              onClick={this.toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Hidden>


            <Typography variant="h6" color="inherit">
              <Link to="/" className={ classes.link }>
                <img src={ opk_krakow_logo } className={classes.logo} alt="logo" />
              </Link>
            </Typography>


            {!this.isAuthenticated() && (
              <div className={classes.rightNav}>
                <Hidden xsDown>
                  <Button color="inherit" onClick={this.gotoRegister}>Register</Button>
                  <Button color="inherit" onClick={this.gotoLogin}>Login</Button>
                </Hidden>
              </div>
            )}

            {this.isAuthenticated() && (
              <div className={classes.rightNav}>
                <Hidden xsDown>
                  <IconButton
                    component={Link}
                    to={`/characters/create`}
                    color="inherit"
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Hidden>
                <IconButton
                  aria-owns={accountOpen ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu('accountAnchorEl')}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.accountAnchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={accountOpen}
                  onClose={this.handleClose('accountAnchorEl')}
                >

                  <Hidden mdUp>
                    <MenuItem
                      component={Link}
                      to={`/profiles/${profileID}`}
                      onClick={this.handleClose('accountAnchorEl')}
                    >
                      Your Profile
                    </MenuItem>
                  </Hidden>
                  <MenuItem
                    component={Link}
                    to={`/account`}
                    onClick={this.handleClose('accountAnchorEl')}
                  >
                    Account settings
                  </MenuItem>
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Drawer open={this.props.portalStore.navigationStore.drawerStatus} onClose={this.toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer}
            onKeyDown={this.toggleDrawer}
          >
            {sideList}
          </div>
        </Drawer>
      </div>

    );
  }
}

TopAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(TopAppBar);
