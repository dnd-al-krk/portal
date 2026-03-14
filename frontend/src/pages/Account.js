import React from 'react';
import {NarrowContent} from "../common/Content";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import {inject, observer} from "mobx-react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//account page /account
const styles = theme => ({
  textField: {
    width: '100%',
  },
  paperContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  submitRow: {
    textAlign: 'right',
  },
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Account extends React.Component {

  SAVE_TEXT = 'Save';

  state = {
    first_name: '',
    last_name: '',
    nickname: '',
    is_saving: false,
    save_text: this.SAVE_TEXT,
  };

  componentDidMount(){
    this.setStateFromStore();
  }

  setStateFromStore = () => {
    const store = this.props.portalStore.currentUser;
    let new_state = {
      first_name: store.first_name,
      last_name: store.last_name,
      nickname: store.nickname,
    };
    this.setState(new_state);
  };

  saveData = () => {
    this.setState({
      is_saving: true,
      save_text: 'Saving...'
    });

    this.props.portalStore.currentUser.first_name = this.state.first_name;
    this.props.portalStore.currentUser.last_name = this.state.last_name;
    this.props.portalStore.currentUser.nickname = this.state.nickname;

    this.props.portalStore.currentUser.saveData().then((response) => {
      this.setState({
        is_saving: false,
        save_text: this.SAVE_TEXT
      })
    });
  };

  render() {

    const {classes} = this.props;

    return (
      <NarrowContent>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Change account settings</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Discord Nickname"
                className={classes.textField}
                value={this.state.nickname}
                onChange={(event) => this.setState({nickname: event.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="name"
                label="First Name"
                className={classes.textField}
                value={this.state.first_name}
                onChange={(event) => this.setState({first_name: event.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="name"
                label="Last Name"
                className={classes.textField}
                value={this.state.last_name}
                onChange={(event) => this.setState({last_name: event.target.value})}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} className={classes.submitRow}>
              <Button variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={this.state.is_saving}
                      onClick={(event) => this.saveData()}>
                { this.state.save_text }
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Password change</Typography>
          <p>Due to security reasons you cannot change your password here. In order to do so, use <Link to="/password-reset">Password Reset Page</Link></p>
          </Grid>
        </form>
      </NarrowContent>
    );
  }
}

export default Account;
