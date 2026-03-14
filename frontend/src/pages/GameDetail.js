import React, {Component, Fragment} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import {dateToString, weekdayOf} from "../utils";
import Spinner from "../common/LoadingDiv";
import Avatar from "@material-ui/core/Avatar/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import UndecoratedLink from "../common/UndecoratedLink";
import List from "@material-ui/core/List/List";
import ProfileListItem from "../common/ProfileListItem";
import PlusIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button/Button";
import IconButton from "@material-ui/core/IconButton/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import Menu from "@material-ui/core/Menu/Menu";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {Link} from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import CannotSignUpOnGameNotification from "../common/CannotSignUpOnGameNotification";

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDoubleUp, faCalendarAlt, faClock, faMapMarker} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

library.add(faAngleDoubleUp);
library.add(faCalendarAlt);
library.add(faClock);
library.add(faMapMarker);

//game details page- opens when you click on game session
const InfoTypography = styled(Typography)`
  && {
    margin-bottom: 10px;
    font-size: 1em;
  }
  
`;


const styles = theme => ({
  root: {
    padding: 20
  },
  header: {
    marginBottom: 10
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 10
  },
  userAvatar: {
    padding: 10,
    width: 24,
    height: 24,
    float: 'left',
    marginRight: 20,
  },
  userName: {
    height: 44,
    lineHeight: '44px',
  },
  gameButton: {
    marginBottom: 20,
    marginTop: 10,
    display: 'block',
  },
  notes: {
    minHeight: 100,
  },
  userInfo: {
    minHeight: 70
  },
  close: {
    color: '#fff',
  },
  spacingRight: {
    marginRight: 12,
  }
});

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class GameDetail extends Component {

  state = {
    game: null,
    characters: null,
    anchorEl: null,
    loading: true,
    reportDialogOpen: false,
    openSnackbar: false,
  };

  componentDidMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.setState({
      loading: true,
    });
    return Promise.all([this.getGame(), this.fetchCharacters()]).then(data => {
      this.setState({
        game: data[0],
        characters: data[1],
        loading: false,
      })
    })
  };

  getGame = () => {
    return this.props.portalStore.games.get(this.props.match.params.id)
  };

  fetchCharacters = () => {
    return this.props.portalStore.fetchProfileCharacters(this.props.portalStore.currentUser.profileID, false);
  };

  gameDate = (game) => {
    const date = new Date(game.date);
    const dateString = dateToString(date);
    const day = weekdayOf(date);
    return `${dateString}, ${day}`;
  };

  gameTime = (game) => {
    if(game.time_end){
      return `${game.time_start} - ${game.time_end}`;
    }
    return `Starting at: ${game.time_start}`
  };

  gameDM = (dm) => {
    return `${dm.first_name} ${dm.last_name} (${dm.nickname})`
  };

  getUserListItem = (player) => {
    return <ProfileListItem key={`signed-up-player-${player.profile.id}`} profile={player.profile} character={player.character}
                            history={this.props.history}/>
  };

  freeSpots = () => {
    return this.state.game.spots - this.takenSpots();
  };

  takenSpots = () => {
    return this.state.game.players.length;
  };

  userIsRunning = () => {
    return this.state.game.dm && this.state.game.dm.id === this.props.portalStore.currentUser.profileID;
  }

  canSignUp = () => {
    const future = this.state.game.ended === false;
    const emptySpot = this.freeSpots() > 0;
    const isDM = this.state.game.dm;
    return isDM && future && !this.userIsRunning() && (emptySpot || this.isSignedUp());
  };

  isSignedUp = () => {
    const players = this.state.game.players.map(player => player.profile.id);
    const player = this.props.portalStore.currentUser.profileID;
    return players.indexOf(player) !== -1
  }

  hasCharacters = () => {
    return this.state.characters.length > 0
  };

  signUp = (characterId) => {
    this.props.portalStore.games.signUp(this.state.game.id, characterId).then(() => {
      this.fetchData();
    });
  };

  signOut = () => {
    this.props.portalStore.games.signOut(this.state.game.id).then(() => {
      this.fetchData();
    });
  };

  showCharacterPick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  hideCharacterPick = () => {
    this.setState({ anchorEl: null });
  };

  handleCharacterPick = (e, id) => {
    this.hideCharacterPick();
    this.signUp(id);
  };

  gotoGameBooking = (e, id) => {
    e.stopPropagation();
    this.props.history.push(`/games/game/${id}/book`);
  };

  cancel = (gameID) => {
    this.props.portalStore.games.cancel(gameID).then(() => {
      this.props.history.push('/games')
    });
  };

  reportGame = () => {
    this.setState({reportDialogOpen: true});
  };

  handleCloseReportStarted = () => {
    this.setState({loading: true});
  };

  handleCloseReport = (success) => {
    if(success)
      this.fetchData();
    this.setState({reportDialogOpen: false, openSnackbar: success});
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  render() {
    const {classes} = this.props;
    const { anchorEl } = this.state;
    if(this.state.loading)
      return (
          <Spinner loading={this.state.loading} />
        );

    const game = this.state.game;

    return (
        <div className={classes.root}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" className={classes.header}>
                {game.adventure.title_display}
              </Typography>
              <InfoTypography variant="body1">
                <FontAwesomeIcon icon="angle-double-up"/> {game.adventure.tier !== null ? `${game.adventure.tier}` : ``}
              </InfoTypography>
              <InfoTypography variant="body1">
                <FontAwesomeIcon icon="calendar-alt"/> {this.gameDate(game)}
              </InfoTypography>
              <InfoTypography variant="body1">
                <FontAwesomeIcon icon="clock"/> {this.gameTime(game)}
              </InfoTypography>
              <InfoTypography variant="body1">
                <FontAwesomeIcon icon="map-marker"/> {game.table_name}
              </InfoTypography>
              <InfoTypography variant="body1">
                {game.table_extra_notes !== "" &&
                    <Fragment><strong>Table note: </strong> {game.table_extra_notes}</Fragment>}
              </InfoTypography>
              <Typography variant="h6" className={classes.header}>
                Dungeon Master
              </Typography>

              {game.dm ? (
                  <div className={classes.userInfo}>
                    <Avatar className={classes.userAvatar}><PersonIcon/></Avatar>
                    <Typography variant="h6" className={classes.userName}>
                      <UndecoratedLink to={`/profiles/${game.dm.id}`}>{this.gameDM(game.dm)}</UndecoratedLink>
                    </Typography>
                  </div>
              ) : (
                  <div className={classes.userInfo}>
                    DM can no longer run this game and a new one is needed!
                    {this.props.portalStore.currentUser.role === 'Dungeon Master' && (
                        <Button color='secondary' variant='contained' className={classes.gameButton}
                                onClick={(e) => {
                                  if (this.isSignedUp) {
                                    this.signOut();                                 }
                                  this.gotoGameBooking(e, game.id);
                                }}>
                          I will run this game
                        </Button>
                    )}
                  </div>
              )}
              <Typography variant="h6" className={classes.header}>
                Additional Notes
              </Typography>
              <Typography variant="body1" className={classes.notes}>
                {game.notes}
              </Typography>
              {game.dm && game.dm.id === this.props.portalStore.currentUser.profileID &&
                  (!this.state.game.ended) &&
                  (
                      <Fragment>
                        <Typography variant="h6" className={classes.header}>
                          Dungeon Master Options
                        </Typography>
                        {!this.state.game.ended && (
                        <Fragment>
                        <Button
                            color='primary'
                            variant='contained'
                            className={classes.gameButton}
                            onClick={(e) => this.gotoGameBooking(e, game.id)}>Edit game details</Button>
                        <Button
                            color='secondary'
                            variant='outlined'
                            className={classes.gameButton}
                            onClick={() => this.cancel(game.id)}>Cancel your booking on this game session</Button>
                        </Fragment>)}
                      </Fragment>
                  )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className={classes.header}>
                Signed up players ({this.takenSpots()}/{this.state.game.spots})
              </Typography>
              <Typography variant='body1'>
                As a player you can sign up here for a game if there are still spots available. If you change your mind,
                you
                can always cancel your sign up by click on the <strong>X</strong> icon next to your name. When you
                cancel,
                the spot will be available to other players.
              </Typography>
              <List>
                {game.players.map(player => this.getUserListItem(player))}
              </List>
              {!this.userIsRunning() &&
                  (<Fragment>
                    {this.hasCharacters() ?
                        this.canSignUp() && (
                            <Fragment>
                              {this.isSignedUp() ? (
                                  <Fragment>
                                    <Button variant="contained"
                                            className={classes.spacingRight}
                                            aria-owns={anchorEl ? 'simple-menu' : null}
                                            aria-haspopup="true"
                                            color="secondary" onClick={this.showCharacterPick}>
                                      Change the character
                                    </Button>
                                    <Button variant="contained"
                                            aria-owns={anchorEl ? 'simple-menu' : null}
                                            aria-haspopup="true"
                                            color="secondary" onClick={this.signOut}>
                                      Sign out
                                    </Button>
                                  </Fragment>
                              ) : (
                                  <Button variant="contained"
                                          aria-owns={anchorEl ? 'simple-menu' : null}
                                          aria-haspopup="true"
                                          color="secondary" onClick={this.showCharacterPick}>
                                    <PlusIcon/>
                                    Join this game
                                  </Button>
                              )}
                              <Menu
                                  id="simple-menu"
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={this.hideCharacterPick}
                              >
                                {this.state.characters.map(character => (
                                    <MenuItem key={`character-pick-item-${character.id}`}
                                              onClick={(e) => this.handleCharacterPick(e, character.id)}>{character.name}, {character.pc_class} {character.level}</MenuItem>
                                ))}
                              </Menu>
                            </Fragment>
                        ) :
                        !this.isSignedUp() && <CannotSignUpOnGameNotification/>
                    }
                  </Fragment>)
              }
              {!this.hasCharacters() && !this.userIsRunning() && (
                  <Fragment>
                    <Typography variant='body1'>
                      You have no character. <Link to='/characters/create'>Create one</Link>, before you can sign up for
                      a game.
                    </Typography>
                  </Fragment>
              )}

            </Grid>
          </Grid>

          <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              open={this.state.openSnackbar}
              autoHideDuration={6000}
              onClose={this.handleSnackbarClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Report sent</span>}
              action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="primary"
                    className={classes.close}
                    onClick={this.handleSnackbarClose}
                >
                  <CloseIcon/>
                </IconButton>,
              ]}
          />
        </div>
    );
  }
}

export default GameDetail;
