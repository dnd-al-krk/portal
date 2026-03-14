import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import {SnackbarContentWrapper} from "./InfoSnackbar";
import Link from "react-router-dom/es/Link";
import {inject, observer} from "mobx-react";
import {openUrl} from "../utils";


const styles = (theme) => ({
  whiteUrl: {
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  snackbarWrapper: {
    padding: 10,
    marginBottom: 20
  },
  snackbar: {
    maxWidth: '100%',
  }
});


@withStyles(styles, {withTheme:true})
@inject('portalStore') @observer
class CannotSignUpOnGameNotification extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.snackbarWrapper}>
        <SnackbarContentWrapper
          variant="warning"
          className={classes.snackbar}
          message={
            (<div>
              You cannot sign up for this game. Check if the game has a DM, it happens in the future, and there are empty spots available.
            </div>)
        }/>
      </div>
    )
  }
}

export default CannotSignUpOnGameNotification;
