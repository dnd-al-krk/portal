import React from 'react'
import classNames from 'classnames';
import {inject, observer} from "mobx-react";
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button";
import {NarrowContent} from "./Content";
import Link from "react-router-dom/es/Link";
import {SnackbarContentWrapper} from "./InfoSnackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {openUrl} from "../utils";
import {ErrorMessageSnackbar} from "./ErrorMessageSnackbar";
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Turnstile from 'react-turnstile';
import { TURNSTILE_SITE_KEY } from "../constants";

// import * as ReactTurnstile from 'react-turnstile';
// console.log(ReactTurnstile);

const styles = (theme) => ({
  textFieldWrapper: {
    padding: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
  submitRow: {
    textAlign: 'right',
  },
  whiteUrl: {
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
});


@withStyles(styles, {withTheme:true})
class RegisterActive extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <div>
        <SnackbarContentWrapper
          variant="success"
          message={(<div>Your account has been activated. <Link to="/login" className={classes.whiteUrl}>You can now login</Link></div>)}/>
      </div>
    )
  }
}

@withStyles(styles, { withTheme: true })
@inject('portalStore') @observer
class Register extends React.Component {
  state = {
    redirectToReferrer: false,
    isSigning: false,
    isDone: false,
    email: '',
    password: '',
    passwordConfirm: '',
    first_name: '',
    last_name: '',
    nickname: '',
    terms: null,
    emailErrors: null,
    passwordErrors: null,
    first_nameErrors: null,
    last_nameErrors: null,
    nicknameErrors: null,
    termsErrors: false,
    nonFieldErrors: null,
    signupText: 'Sign up',
    showPassword: false,
    turnstileToken: null,
  };

  handleToken = (token) => {
    this.setState({turnstileToken: token});
  };

  signup = (e) => {
    e.preventDefault();
    if(this.state.password === this.state.passwordConfirm) {
      if(this.state.password.length < 8){
        this.setState({passwordErrors: 'The password should have at least 8 characters.'});
        return;
      }
      if(!this.state.terms){
        this.setState({termsErrors: true});
        return;
      }
      this.setState({
        isSigning: true
      });
      this.props.portalStore.register({
        nickname: this.state.nickname,
        user: {
          email: this.state.email.toLowerCase(),
          password: this.state.password,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
        },
        turnstile_token: this.state.turnstileToken,
      })
        .then(() => {
          this.setState(() => ({
            email: '',
            password: '',
            isSigning: false,
            isDone: true,
          }))
        }).catch(error => {
          const new_state = {
            emailErrors: null,
            passwordErrors: null,
            first_nameErrors: null,
            last_nameErrors: null,
            nicknameErrors: null,
            nonFieldErrors: null,
          };
          const data = error.response.data;
          Reflect.ownKeys(data).forEach(key => {
            if (data[key].constructor.name.toLowerCase() === "object") {
              Reflect.ownKeys(data[key]).forEach(innerKey => {
                new_state[innerKey + 'Errors'] = data[key][innerKey][0];
              })
            }
            else {
              new_state[key + 'Errors'] = data[key][0];
            }
          });
          if (data["user"] && data["user"]["non_field_errors"]) {
            new_state.nonFieldErrors = data["user"]["non_field_errors"]
          }
          new_state.isSigning = false;
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

  handleCheckChange = prop => event => {
    this.setState({ [prop]: event.target.checked, [prop+"Errors"]: false});
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
        {!this.state.isDone && (
          <form className={classes.container}  noValidate autoComplete="off" onSubmit={this.signup}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h1>Sign up</h1>
                <p>Register in order to access the Organized Play Krakow system and start playingA.</p>
              </Grid>
              {this.state.nonFieldErrors && (
                <Grid item xs={12}>
                  <ErrorMessageSnackbar message={this.state.nonFieldErrors}/>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  id="signUp-email"
                  label="E-mail address"
                  error={!!this.state.emailErrors}
                  aria-describedby="email-error-text"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  variant="outlined"
                  helperText={this.state.emailErrors ? this.state.emailErrors : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl className={classNames(classes.margin, classes.textField)} variant="outlined">
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
                <FormControl className={classNames(classes.margin, classes.textField)} variant="outlined">
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
                          aria-label="toggle password visibility"
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
              <Grid item xs={12}>
                <TextField
                  id="signUp-nickname"
                  className={classes.textField}
                  type="text"
                  label="Discord Nickname"
                  value={this.state.nickname}
                  onChange={this.handleChange('nickname')}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6} className={classes.textFieldWrapper}>
                <TextField
                  id="signUp-first-name"
                  type="text"
                  label="First name"
                  className={classes.textField}
                  error={!!this.state.first_nameErrors}
                  aria-describedby="last-name-error-text"
                  value={this.state.first_name}
                  onChange={this.handleChange('first_name')}
                  variant="outlined"
                  helperText={this.state.first_nameErrors ? this.state.first_nameErrors : ""}
                />
              </Grid>
              <Grid item xs={12} md={6} className={classes.textFieldWrapper}>
                <TextField
                  id="signUp-last-name"
                  type="text"
                  label="Last name"
                  className={classes.textField}
                  error={!!this.state.last_nameErrors}
                  aria-describedby="name-error-text"
                  value={this.state.last_name}
                  onChange={this.handleChange('last_name')}
                  helperText={this.state.last_nameErrors ? this.state.last_nameErrors : ""}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.terms}
                      onChange={this.handleCheckChange('terms')}
                      aria-describedby="terms-error-text"
                    />
                  }
                  label={(<div>I agree with <a href='/terms' onClick={openUrl}>Terms of use</a></div>)}
                />
                {this.state.termsErrors && (<FormHelperText id="terms-error-text">You cannot register until you agree to our terms.</FormHelperText>)}
              </Grid>
              <Grid item xs={12}>
                <Turnstile
                  sitekey={TURNSTILE_SITE_KEY}
                  onVerify={this.handleToken}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}
                        disabled={this.state.isSigning || !this.state.turnstileToken}
                        onClick={this.signup}>
                  { this.state.signupText }
                </Button>
              </Grid>
              <Grid item xs={12}>
                <p>Already registered? <Link to="/login">Sign in</Link></p>
                <p>Forgotten password? Go to <Link to="/password-reset">Password Reset Page</Link></p>
              </Grid>
            </Grid>
          </form>
        )}
        {this.state.isDone && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h1>Sign up</h1>
              <p>All set! We have sent you activation e-mail. You won't be able to login until you click the link it contains.</p>
            </Grid>
          </Grid>
        )}
      </NarrowContent>
    )
  }
}

export { RegisterActive };
export default Register;
