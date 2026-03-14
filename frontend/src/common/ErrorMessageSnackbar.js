import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import {SnackbarContentWrapper} from "./InfoSnackbar";


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
class ErrorMessageSnackbar extends React.Component {
  render() {
    const {classes, message} = this.props;

    return (
      <div className={classes.snackbarWrapper}>
        <SnackbarContentWrapper
          variant="error"
          className={classes.snackbar}
          message={
            (<div>
              {message}
            </div>)
        }/>
      </div>
    )
  }
}

export { ErrorMessageSnackbar };
