import React from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import {inject, observer} from "mobx-react";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import {InputField, SelectField} from "../common/Fields";
import Spinner from "../common/LoadingDiv";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {NarrowContent} from "../common/Content";
import FormHelperText from "@material-ui/core/FormHelperText";
import Link from "react-router-dom/es/Link";
import TextField from "@material-ui/core/TextField";

//character edit page /characters/[character-hash]/edit
const styles = (theme) => ({
  addButton: {
    marginTop: 20,
    float: 'right',
  },
  textField: {
    width: '100%',
  },
  info: {
    marginBottom: theme.spacing(4)
  },
});


@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class CharacterEdit extends React.Component {

  state = {
    id: this.props.match.params.id,
    loading: true,
    name: '',
    level: 1,
    notes: '',
    race: '',
    class: '',
    race_error: '',
    class_error: '',
    faction: '',
    dead: false,
    buttonDisabled: false,
    buttonText: 'Save changes',
    snackbarOpen: false,
  };

  componentDidMount(){
    this.props.portalStore.getCharacter(this.state.id)
      .then(
        (data) => {
          if(data.owner !== this.props.portalStore.currentUser.profileID){
            this.props.history.push('/');
            return;
          }
          this.setState({
            name: data.name,
            level: data.level,
            notes: data.notes === null ? '': data.notes,
            race: data.race,
            class: data.pc_class,
            faction: data.faction === null ? '': data.faction,
            loading: false,
            dead: data.dead
          })
        }
      )
  }


  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleCheckBoxChange = prop => event => {
    this.setState( {[prop]: event.target.checked } )
  };

  isFormValid = () => {
    const s = this.state;
    if(s.race.length < 1) { this.setState({race_error: 'No race selected'}); return false; }
    if(s.class.length < 1) return false;
    if(s.level > 20 || s.level < 1) return false;
    return s.name.length > 0;
  };

  saveCharacter = () => {
    const s = this.state;
    if(this.isFormValid()) {
      this.setState({
        buttonDisabled: true,
        buttonText: 'Saving...',
      });
      this.props.portalStore.saveCharacter(this.state.id, {
        'name': s.name,
        'level': s.level,
        'notes': s.notes,
        'race': s.race,
        'pc_class': s.class,
        'faction': s.faction,
        'dead': s.dead,
      }).then(response => {
        this.setState({
          buttonDisabled: false,
          buttonText: 'Save changes',
        });
        this.props.history.push('/profiles/' + this.props.portalStore.currentUser.profileID);
      });
    }
    else {
      this.setState({
        snackbarOpen: true,
      });
    }
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
        snackbarOpen: false,
      });
  };

  render() {
    const {classes} = this.props;


    return (
      <NarrowContent>
        {this.state.loading ? (
            <Spinner loading={this.state.loading} />
          )
          : (
            <div>
              <Typography variant="h6">
                Edit {this.state.name}
              </Typography>
              <Typography variant='body1' className={classes.info}>
                In order to sign up for a game session slot, you need to select one of your characters. Here you can edit
                your character. Provided information may be useful for the Dungeon Master to prepare a game for you.
              </Typography>

              <form onSubmit={this.saveCharacter}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      name={'name'}
                      label={'Character name'}
                      value={this.state.name}
                      onChange={this.handleChange('name')}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name={'level'}
                      label={'Character total level'}
                      value={this.state.level}
                      type={'number'}
                      onChange={this.handleChange('level')}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name={'race'}
                      label={'Character Race'}
                      value={this.state.race}
                      onChange={this.handleChange('race')}
                      required={true}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name={'class'}
                      label={'Character Class'}
                      value={this.state.class}
                      onChange={this.handleChange('class')}
                      required={true}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name={'faction'}
                      label={'Character Faction'}
                      value={this.state.faction}
                      onChange={this.handleChange('faction')}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name={'notes'}
                      label={'Additional notes / multiclassing / items etc.'}
                      value={this.state.notes}
                      type={'text'}
                      multiline={true}
                      onChange={this.handleChange('notes')}
                      variant="outlined"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={
                      <Checkbox name={'dead'}
                                onChange={this.handleCheckBoxChange('dead')}
                                checked={this.state.dead}/>
                      }
                      label={'Killed in Action'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button color="secondary" variant={'contained'} className={classes.addButton} onClick={this.saveCharacter}
                            disabled={this.state.buttonDisabled}>
                      {this.state.buttonText}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Snackbar
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      open={this.state.snackbarOpen}
                      onClose={this.handleSnackbarClose}
                      autoHideDuration={6000}
                      ContentProps={{
                        'aria-describedby': 'message-id',
                      }}
                      message={<span id="message-id">Cannot save the character. Check all fields before trying again!</span>}
                    />
                  </Grid>
                </Grid>
              </form>
            </div>
          )}
      </NarrowContent>
    )
  }
}

export default CharacterEdit;
