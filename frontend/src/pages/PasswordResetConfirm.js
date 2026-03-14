import React from 'react'
import classNames from 'classnames';
import {inject, observer} from "mobx-react";
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

//password reset page /password-reset/[pwd-reset-hash]

const styles = (theme) => ({
  textField: {
    width: '100%',
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
class PasswordResetConfirm extends React.Component {
  state = {
    isSigning: false,
    done: false,
    password: '',
    passwordConfirm: '',
    passwordErrors: null,
    buttonText: 'Change password',
    showPassword: false,
  };

  reset = (e) => {
    e.preventDefault();
    if(this.state.password === this.state.passwordConfirm) {
      if(this.state.password.length < 8){
        this.setState({passwordErrors: 'The password should have at least 8 characters.'});
        return;
      }
      this.setState({
        isSigning: true
      });
      this.props.portalStore.changePassword(this.props.match.params.token, this.state.password)
        .then(() => {
          this.setState(() => ({
            isSigning: false,
            done: true,
          }))
        }).catch(error => {
          const new_state = {
            passwordErrors: error.response.data.status === 'notfound' ? 'Incorrect token' : error.response.data.status,
            isSigning: false,
          };
          this.setState(new_state);
        });
    }
    else {
      this.setState({passwordErrors: "Passwords don't match"});
    }
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  diffPasswords = () => {
    return this.state.passwordConfirm !== '' && (this.state.password === '' || this.state.password !== this.state.passwordConfirm);
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    const {classes} = this.props;

    return (
      <NarrowContent>
        {!this.state.done ? (
          <form className={classes.container} noValidate autoComplete="off" onSubmit={this.signup}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h1>Password change</h1>
                <p>Put new password below to change it.</p>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)} variant="outlined">
                  <InputLabel htmlFor="signUp-password">Password</InputLabel>
                  <OutlinedInput
                    id="signUp-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    error={!!this.state.passwordErrors}
                    aria-describedby="password-error-text"
                    onChange={this.handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                          edge="end"
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                 {this.state.passwordErrors && (<FormHelperText id="password-error-text">{this.state.passwordErrors}</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                 <FormControl className={classNames(classes.inputMargin, classes.textField)} variant="outlined">
                  <InputLabel htmlFor="signUp-password-confirm">Repeat Password</InputLabel>
                  <OutlinedInput
                    id="signUp-password-confirm"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.passwordConfirm}
                    onChange={this.handleChange('passwordConfirm')}
                    error={this.diffPasswords()}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                          edge="end"
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                   {this.diffPasswords() && (<FormHelperText id="first-name-error-text">Passwords don't match!</FormHelperText>)}
                </FormControl>
              </Grid>
              <Grid item xs={12} className={classes.submitRow}>
                <Button variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        disabled={this.state.isSigning}
                        onClick={this.reset}>
                  { this.state.buttonText }
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <h1>Password change</h1>
              <p>All set! Your password is changed. Now you can <Link to="/login">sign in</Link>.</p>
            </Grid>
          </Grid>
        )}
      </NarrowContent>
    )
  }
}

export default PasswordResetConfirm;
