import React from 'react';
import {inject, observer} from "mobx-react";
import {Redirect, Route} from "react-router-dom";
import {withRouter} from "react-router";


const RouteRequiresLogin = inject('portalStore')(
  observer(({ portalStore, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    portalStore.isAuthenticated() ? (
      <div>
        <Component {...props}/>
      </div>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)));

export default withRouter(RouteRequiresLogin);
