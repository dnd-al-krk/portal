import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button/Button";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Chip from "@material-ui/core/Chip/Chip";
import RoomIcon from "@material-ui/icons/Room";
import PersonIcon from "@material-ui/icons/Person";
import ExclamationIcon from "@material-ui/icons/Warning";
import GamesStore from "../stores/GamesStore";
import {Link, withRouter} from "react-router-dom";
import classNames from 'classnames';
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from "@material-ui/core/CardHeader/CardHeader";

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDoubleUp, faCalendarAlt, faChair, faDiceD20} from '@fortawesome/free-solid-svg-icons'
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import styled from 'styled-components';

library.add(faChair);
library.add(faDiceD20);
library.add(faAngleDoubleUp);
library.add(faCalendarAlt);

//games archive /games/archive
const TierDiv = styled.div`
  margin-top: 5px;
`;

const SubheadingDiv = styled.div`
  font-size: 18px;
  margin-top: 10px
`;

const styles = theme => ({
  root: {
    padding: '0 20px',
  },
  cardsRoot: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  spots: {
    padding: 10
  },
  gameSession: {
    marginBottom: 20,
  },
  actions: {
    display: 'flex',
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  title: {
    marginBottom: 10,
  },
  gameItemOfDM: {
    borderLeft: '5px solid #333333',
  },
  gameItemOfPlayer: {
    borderLeft: '5px solid #DF9E00',
  },
  currentDM: {
    backgroundColor: '#DF9E00',
    color: 'white',
  }
});


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
@withRouter
class GameInfo extends React.Component {

  gotoDM = (e, id) => {
    e.stopPropagation();
    this.props.history.push(`/profiles/${id}`);
  };

  spotsLeft = (game) => {
    return Math.max(game.spots - game.players.length, 0)
  };


  render(){
    const { game, classes } = this.props;
    const spots = this.spotsLeft(game);

    return (
      <Fragment>
        <Chip avatar={<Avatar><RoomIcon/></Avatar>} label={game.table_name} className={classes.chip} />
        {!game.ended && (<Chip avatar={<Avatar><FontAwesomeIcon icon="chair" /></Avatar>} label={`${spots} spots left`} className={classes.chip}/>)}
        {game.adventure && (
          <Fragment>
            {game.dm ? (
              <Fragment>
                {game.dm.id !== this.props.portalStore.currentUser.profileID ? (
                  <Chip avatar={<Avatar><PersonIcon/></Avatar>} label={GamesStore.getDMName(game)}
                        onClick={(e) => this.gotoDM(e, game.dm.id)} className={classes.chip}/>
                ):(
                  <Chip avatar={<Avatar className={classes.currentDM}><PersonIcon/></Avatar>} label={'Your game'}
                        onClick={(e) => this.gotoDM(e, game.dm.id)}
                        className={classNames(classes.chip, classes.currentDM)}/>
                )}

              </Fragment>
            ) : (
              <Chip color="secondary"
                    variant="outlined"
                    avatar={<Avatar><ExclamationIcon/></Avatar>}
                    label={`The DM can no longer run this game!`}
                    className={classes.chip}/>
            )}
          </Fragment>
        )}
      </Fragment>
    )
  }
}

@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
@withRouter
class GameCard extends React.Component {

  isEmpty = () => {
    return this.props.game.adventure === null;
  };

  getDate = () => {
    const { game, classes } = this.props;
    return <SubheadingDiv>
    <FontAwesomeIcon icon='calendar-alt'/> { game.ended ? (GamesStore.getFullDateString(game) + ' ' + GamesStore.getWeekDay(game) + ' ' + game.time_start) : (GamesStore.getDateString(game) + ' ' + GamesStore.getWeekDay(game) + ' ' + game.time_start) }
        <strong>{game.timeStart}</strong>
        { game.adventure && game.adventure.tier !== null ? (<TierDiv><FontAwesomeIcon icon="angle-double-up" /> {game.adventure.tier}</TierDiv>) : `` }
      </SubheadingDiv>;
  };

  gotoGameBooking = (e) => {
    const id = this.props.game.id;
    e.stopPropagation();
    this.props.history.push(`/games/game/${id}/book`);
  };

  getItemClassNames = (game) => {
    const {classes} = this.props;
    const profileID = this.props.portalStore.currentUser.profileID;
    if(game.dm && game.dm.id === profileID)
      return classes.gameItemOfDM;
    if(game.players.map(player => player.profile.id).some((id) => id === profileID))
      return classes.gameItemOfPlayer;
    return null;
  };


  render() {
    const {classes, game} = this.props;

    return <Card className={classNames(this.getItemClassNames(game), classes.card)} key={`game-list-card-${game.id}`}>
          <CardActionArea
            component={Link}
            to={`/games/game/${game.id}`}
            disabled={ !game.adventure }
          >
            <CardHeader
              title={<Typography variant="subtitle1" style={{fontSize: 18}}><FontAwesomeIcon icon='dice-d20'/> {
                  this.isEmpty() ? 'Empty slot' : game.adventure.title_display
                }
              </Typography>}
              subheader={this.getDate()}
            />
            <CardContent>
              <GameInfo game={game}/>
            </CardContent>
          </CardActionArea>

          <CardActions>
            {!game.dm && this.props.portalStore.currentUser.role === 'Dungeon Master' && (
              <Button size="small" variant="outlined" color="primary" onClick={(e) => this.gotoGameBooking(e)}>
                Run a game in this slot
              </Button>
            )}
          </CardActions>
        </Card>
  }
}


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
@withRouter
class Games extends React.Component {

  gameFull = (game) => {
    return Math.max(game.spots - game.players.length, 0) === 0
  };

  render() {
    const {list, classes, displayEmpty=false, displayFull=true} = this.props;
    return (
      <Fragment>
        <Grid container spacing={4} className={classes.cardsRoot}>
          {list.map(game => (
            <Fragment key={`game-${game.id}`}>
              {(
                (displayEmpty || game.adventure) &&
                (displayFull || !this.gameFull(game))
              ) ? (
                <Grid item xs={12} md={6} lg={4} key={`game-list-card-${game.id}`}>
                  <GameCard game={game}/>
                </Grid>
                ) : (null)}
            </Fragment>
          ))}
        </Grid>
      </Fragment>
    );
  }
}

export { GameInfo, GameCard };
export default Games;
