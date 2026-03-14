import React from 'react'
import classNames from 'classnames';
import {inject, observer} from "mobx-react";
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import {NarrowContent} from "../common/Content";
import Link from "react-router-dom/es/Link";
import TextField from "@material-ui/core/TextField";

//password reset page /password-reset
const styles = (theme) => ({
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
  inputMargin: {
    margin: `0`,
  },
});


@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class PasswordReset extends React.Component {
  state = {
    redirectToReferrer: false,
    isSigning: false,
    done: false,
    email: '',
    buttonText: 'Reset Password',
    showPassword: false,
    errors: null,
  };

  reset = (e) => {
    e.preventDefault();
    this.setState({
      isSigning: true
    });
    this.props.portalStore.sendPasswordReset(this.state.email)
      .then(() => {
        this.setState(() => ({
          done: true,
          isSigning: false
        }))
      }).catch((error) => {
        if(error.response.status === 400){
          this.setState({
            errors: error.response.data.email,
            isSigning: false,
          })
        }
    });
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const {classes} = this.props;

    return (
      <NarrowContent>
        {this.state.done ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h1>Reset your password</h1>
                <p>Check your e-mail. We have sent you password reset link.</p>
              </Grid>
            </Grid>
          ): (
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h1>Reset your password</h1>
                <p>If you have forgotten your password, you can reset it. Put your login e-mail address below. We will
                  send you password reset link to it.</p>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="signIn-email"
                  type="text"
                  label="Email address"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  variant="outlined"
                  className={classes.textField}
                />
              </Grid>
              <Grid item xs={12} className={classes.errors}>
                {this.state.errors}
              </Grid>
              <Grid item xs={12} className={classes.submitRow}>
                <Button variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        disabled={this.state.isSigning}
                        onClick={this.reset}>
                  {this.state.buttonText}
                </Button>
              </Grid>
              <Grid item xs={12}>
                No account yet? <Link to='/register'>Sign up!</Link>
              </Grid>
            </Grid>
          </form>)
        }
      </NarrowContent>
    )
  }
}

export default PasswordReset;
