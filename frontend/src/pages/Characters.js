import React from 'react';
import {inject, observer} from "mobx-react";
import withStyles from '@material-ui/core/styles/withStyles';
import Spinner from "../common/LoadingDiv";
import {WideContent} from "../common/Content";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Button from "@material-ui/core/Button/Button";
import CharactersList from "../common/CharactersList";

const styles = (theme) => ({

});
//characters list (global) /characters
@withStyles(styles, {withTheme: true})
@inject('portalStore') @observer
class Characters extends React.Component{

  state = {
    loading: true,
    characters: [],
    search: '',
    searched: false,
  };

  componentDidMount(){

    this.props.portalStore.fetchCharacters().then(
      (data) => {
        this.setState({
          characters: data,
          loading: false,
        });
      },
      () => {
        this.setState({
          characters: null,
          loading: false,
        })

      }
    );
  }

  search(){
    this.setState({
      loading: true,
      searched: true,
    });
    this.props.portalStore.searchCharacters(this.state.search)
      .then((data) => {
        this.setState({
          characters: data,
          loading: false,
        })
      })
  }

  gotoCharacterCreate = () => {
    this.props.history.push('/characters/create');
  };

  render() {
    return (
      <WideContent>
        {this.state.loading ? (
            <Spinner loading={this.state.loading}/>
          )
          : (
            <div>
              <Typography variant="h6">
                League characters
              </Typography>
              <Grid container spacing={8} style={{margin: '20px 0'}}>
                <Grid item xs={12} sm={9}>
                  <FormControl
                      style={{width: '100%'}}>
                    <InputLabel htmlFor="signIn-email">Search character or player</InputLabel>
                    <Input
                      style={{width: '100%'}}
                      id="signIn-email"
                      type="text"
                      autoFocus={this.state.searched}
                      value={this.state.search}
                      onKeyPress={(e) => {
                        if(e.charCode === 13){
                          this.setState({search: e.target.value});
                          this.search();
                        }
                      }}
                      onChange={(e) => { this.setState({search: e.target.value })}}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button variant={'contained'} onClick={() => this.search()}>Search</Button>
                </Grid>
              </Grid>
              <Button variant={'contained'} onClick={this.gotoCharacterCreate}>Add new character</Button>
              <CharactersList characters={this.state.characters}/>
            </div>
          )
        }
      </WideContent>
    );
  }
}

export default Characters;
