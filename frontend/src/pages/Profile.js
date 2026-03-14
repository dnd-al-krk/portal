import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import React, {Fragment} from "react";
import Person from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {NarrowContent} from "../common/Content";
import CharactersList from "../common/CharactersList";
import Button from "@material-ui/core/Button/Button";
import Divider from "@material-ui/core/Divider/Divider";
import Spinner from "../common/LoadingDiv";

//user profile page- /profiles/[user-id]
const styles = theme => ({
  avatar: {
    float: 'left',
    marginRight: 10,
    width: 60,
    height: 60,
  },
  avatarIcon: {
    width: 50,
    height: 50,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%',
  },
  paperContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  submitRow: {
    textAlign: 'right',
  },
  profileHeader: {
    marginBottom: 30,
  },
  charactersList: {
  },
  divider: {
    marginBottom: 20
  }
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Profile extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      id: this.props.match.params.id,
      profile: null,
      loading: true,
    }
  }

  componentDidMount(){
    this.props.portalStore.getProfile(this.state.id)
      .then(
        (data) => {
          this.setState({
            profile: data,
          });
        },
        () => {
          this.setState({
            profile: null,
          })
        }
      )
      .then(
        () => Promise.all([
            this.props.portalStore.fetchProfileCharacters(this.state.id, false),
            this.props.portalStore.fetchProfileCharacters(this.state.id, true)
        ]
        ).then( 
            (char_array) => { 
              this.setState({
                characters: char_array[0],
                dead_characters: char_array[1],
              })
            }
        )
      )
      .then( 
        () => { 
            this.setState( { 
                loading: false 
            } ) 
        } 
     );
  }

  gotoCharacterCreate = () => {
    this.props.history.push('/characters/create');
  };

  render() {
    const {classes} = this.props;

    const profile = this.state.profile;

    return (
      <NarrowContent className={classes.root}>
        {this.state.loading ? (
          <Spinner loading={this.state.loading} />
          )
          : (
          <Grid container spacing={8}>
            <Grid item xs={12} className={classes.profileHeader}>
              <Avatar className={classes.avatar}>
                <Person className={classes.avatarIcon} />
              </Avatar>
              <Typography variant="h6">
                {profile.first_name} {profile.last_name} ({profile.nickname})
              </Typography>
              <Typography variant="body1">
                {profile.role}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.charactersList}>
              {this.state.characters.length > 0 && (
                <Fragment>
                  <Typography variant="h6">
                    Characters
                  </Typography>
                  <CharactersList characters={this.state.characters} use_by={false}/>
                </Fragment>
              )}
              {this.state.dead_characters.length > 0 && (
                <Fragment>
                  <Typography variant="h6">
                    Fallen Characters
                  </Typography>
                  <CharactersList characters={this.state.dead_characters} use_by={false}/>
                </Fragment>
              )}
              {this.props.portalStore.currentUser.profileID === profile.id && (
                <Fragment>
                  <Divider className={classes.divider}/>
                  <Button variant='contained' color='secondary' onClick={this.gotoCharacterCreate}>Add new character</Button>
                </Fragment>
              )}
            </Grid>
          </Grid>
          )}
      </NarrowContent>
    )
  }
}

export default Profile;
