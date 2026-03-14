import {action, observable} from 'mobx';
import {API_HOSTNAME} from "./config";
import GamesStore from "./stores/GamesStore";
import AdventuresStore from "./stores/AdventuresStore";
import TokenAuthorizationStore, {axiosInstance} from "./stores/TokenAuthorizationStore";
import UserStore from "./stores/UserStore";
import NavigationStore from "./stores/NavigationStore";
import Api from "./api";


export class PortalStore {
  @observable auth;
  @observable api;
  @observable currentUser = null;
  @observable signed = false;
  @observable navigationStore;
  @observable games;
  @observable adventures;

  constructor(){
    this.auth = new TokenAuthorizationStore(this);
    this.api = new Api(this.auth);
    this.navigationStore = new NavigationStore(this);
    this.games = new GamesStore(this);
    this.adventures = new AdventuresStore(this);
  }

  @action.bound
  isAuthenticated(){
    return this.signed;
  }

  @action.bound
  login(user, password){
    return new Promise((resolve) => {
      this.auth.login(user, password).then(response => {
        this.currentUser = new UserStore(this);
        this.currentUser.fetchData().then(() => {
          this.signed = true;
          resolve(response)
        });
      });
    });
  }

  @action.bound
  signOut(){
    this.currentUser = null;
    this.signed = false;
  }

  @action.bound
  fullSignOut(){
    this.auth.signOut();
  }

  @action.bound
  autologin(){
    return new Promise((resolve, reject) => {
      this.auth.autologin().then(response => {
        if(response !== null){
          this.currentUser = new UserStore(this);
          this.currentUser.fetchData()
            .then(
              () => { this.signed = true; resolve(response)},
              () => { reject(response) })
            .catch((err) => { reject(err); });
        }
        else{
          reject(response)
        }
      })
    });
  }

  register(data){
    return axiosInstance.post(`${API_HOSTNAME}/register/`, data)
  }

  sendPasswordReset(login){
    return axiosInstance.post(`${API_HOSTNAME}/password_reset/`, {email: login})
  }

  changePassword(token, password){
    return axiosInstance.post(`${API_HOSTNAME}/password_reset/confirm/`, {token: token, password: password});
  };

  @action.bound
  fetchProfiles() {
    return this.api.fetchData('profiles')
  }

  @action.bound
  getProfile(id){
    return this.api.getData('profiles', id);
  }

  @action.bound
  fetchCharacters(){
    return this.api.fetchData('characters');
  }

/*
  @action.bound
  fetchCharacters(){
    return this.api.fetchData('games');
  }
*/
  @action.bound
  fetchProfileCharacters(owner, dead){

    var dead_str = (typeof dead !== 'undefined') ? `&dead=${dead ? 1 : 0}` : ``;
    
    return this.api.get(`/characters/?owner=${owner}${dead_str}`).then(response => response.data);
  }

  @action.bound
  getCharacter(id){
    return this.api.get(`/characters/${id}/`).then(response => response.data);
  }

  @action.bound
  searchCharacters(search_term){
    return this.api.get(`/characters/?search=${search_term}`).then(response => response.data);
  }

  @action.bound
  createCharacter(data){
    return this.api.post(`/characters/`, data).then(response => {
      if(response.status === 201){
        this.currentUser.charactersCount++;
      }
    });
  }

  @action.bound
  saveCharacter(id, data){
    return this.api.put(`/characters/${id}/`, data);
  }
}

