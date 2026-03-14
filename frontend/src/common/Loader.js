import {inject, observer} from "mobx-react";
import {Component} from "react";
import React from "react";
import styled from 'styled-components';
import LoadingDiv from "./LoadingDiv";


@inject('portalStore') @observer
class Loader extends Component {

  state = {
    loading: true,
  };

  componentDidMount() {
    if(!this.props.portalStore.currentUser)
      this.props.portalStore.autologin()
        .then(
          () => { this.removeLoader() },
          () => { this.removeLoader() });
  };

  removeLoader = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    if (this.state.loading) {
      return (<LoadingDiv>loading...</LoadingDiv>) }
    else {
      return (
        <div>
          { this.props.children }
        </div>
      )
    }
  }
}

export default Loader;
