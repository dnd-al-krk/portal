import React, {Component} from 'react';

import {PortalStore} from './store';
import {observer, Provider} from 'mobx-react';
import {BrowserRouter as Router, Route,} from 'react-router-dom';

import './App.css';
import Account from "./pages/Account";
import Characters from "./pages/Characters";
import Home from "./pages/Home";
import TopAppBar from "./common/TopAppBar";
import styled from 'styled-components';
import RouteRequiresLogin from "./common/RouteRequiresLogin";
import Login from "./common/Login";
import Loader from "./common/Loader";
import Profiles from "./pages/Profiles";
import Profile from "./pages/Profile";
import CharacterCreate from "./pages/CharacterCreate";
import CharacterEdit from "./pages/CharacterEdit";
import Register, {RegisterActive} from "./common/Register";
import GameBooking from "./pages/GameBooking";
import GameDetail from "./pages/GameDetail";
import {FutureGamesList, GamesList, PastGamesList} from "./pages/GamesList";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import SidebarNavigationList from "./common/SidebarNavigationList";
import Grid from "@material-ui/core/Grid/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Terms from "./common/Terms";
import CookieConsent from "react-cookie-consent";
import FirstGame from "./common/FirstGame";


const portalStore = new PortalStore();

const PushedDiv = styled.div`
  padding-top: 80px;
`;


const renderWithProps = (Component) => (routeProps) => (
  <Component {...routeProps}/>
);

@observer
class App extends Component {

  render() {
    return (
      <Provider portalStore={portalStore}>
        <Loader>
          <Router>
            <div>
              <TopAppBar/>
              <PushedDiv>
                <Grid container spacing={1}>
                  <Hidden smDown>
                    <Grid item md={3} lg={2}>
                      <SidebarNavigationList/>
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} md={9} lg={10}>
                    <Route exact path="/" render={renderWithProps(Home)}/>
                    <Route exact path="/password-reset/" render={renderWithProps(PasswordReset)}/>
                    <Route exact path="/password-reset/:token" render={renderWithProps(PasswordResetConfirm)}/>
                    <RouteRequiresLogin exact path="/games/archive" component={PastGamesList}/>
                    <RouteRequiresLogin exact path="/games" component={FutureGamesList}/>
                    <RouteRequiresLogin exact path="/games/game/:id" component={GameDetail}/>
                    <RouteRequiresLogin exact path="/games/game/:id/book" component={GameBooking}/>
                    <RouteRequiresLogin exact path="/profiles" component={Profiles}/>
                    <RouteRequiresLogin exact path="/profiles/:id" component={Profile}/>
                    <RouteRequiresLogin exact path="/characters" component={Characters}/>
                    <RouteRequiresLogin exact path="/characters/create" component={CharacterCreate}/>
                    <RouteRequiresLogin exact path="/characters/:id/edit" component={CharacterEdit}/>
                    <RouteRequiresLogin path="/account" component={Account}/>
                    <Route exact path="/login" render={renderWithProps(Login)}/>
                    <Route exact path="/register" render={renderWithProps(Register)}/>
                    <Route exact path="/register/activated" render={renderWithProps(RegisterActive)}/>
                    <Route exact path="/terms" render={renderWithProps(Terms)}/>
                    <Route exact path="/poradnik-pierwsza-sesja" render={renderWithProps(FirstGame)}/>
                  </Grid>
                </Grid>
              </PushedDiv>
              <CookieConsent
                style={{ background: "#333", opacity: "0.95"}}
                buttonStyle={{ fontWeight: "bold", background: "#DF9E00", padding: "12px", color: "black"}}
                > 
                We use cookies to offer you a better experience. By continuing to use this website, you consent to the use of cookies in accordance with our Cookie Policy.
              </CookieConsent>
            </div>
          </Router>
        </Loader>
      </Provider>
    );
  }
}

export default App;
