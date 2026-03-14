import Cookies from "js-cookie";
import axios from "axios";
import {action, computed, observable, reaction} from "mobx";
import {
  JWT_TOKEN,
  JWT_TOKEN_IAT,
  JWT_TOKEN_ORIG_IAT,
  TOKEN_EXPIRATION_DELTA,
  TOKEN_REFRESH_EXPIRATION, TOKEN_REFRESH_RATE
} from "../constants";
import {API_HOSTNAME} from "../config";

const csrftoken = Cookies.get('csrftoken');
const REFRESH_TOKEN = 'refresh_token';

export const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': csrftoken,
  }
});


export default class TokenAuthorizationStore {
  @observable root = null;
  @observable token = window.localStorage.getItem(JWT_TOKEN);
  @observable refresh_token = window.localStorage.getItem(REFRESH_TOKEN);
  @observable token_iat = window.localStorage.getItem(JWT_TOKEN_IAT);
  @observable token_original_iat = window.localStorage.getItem('jwt_orig_iat');

  constructor(root) {
    this.root = root;

    reaction(
      () => this.token,
      token => {
        if (token){
          window.localStorage.setItem(JWT_TOKEN, token);
        } else {
          window.localStorage.removeItem(JWT_TOKEN);
        }
      }
    );

    reaction(
      () => this.refresh_token,
      refresh_token => {
        if (refresh_token){
          window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
        } else {
          window.localStorage.removeItem(REFRESH_TOKEN);
        }
      }
    );

    reaction(
      () => this.token_iat,
      token_iat => {
        if (token_iat) {
          window.localStorage.setItem(JWT_TOKEN_IAT, token_iat);
        } else {
          window.localStorage.removeItem(JWT_TOKEN_IAT);
        }
      }
    );

    reaction(
      () => this.token_original_iat,
      token_iat => {
        if (token_iat) {
          window.localStorage.setItem(JWT_TOKEN_ORIG_IAT, token_iat);
        } else {
          window.localStorage.removeItem(JWT_TOKEN_ORIG_IAT);
        }
      }
    );
  }

  @computed get tokenValidIat(){
    // checks if token is refreshable - maybe it is too late for it to be refreshed?
    return this.token_iat !== undefined && new Date().getTime() < this.token_iat + TOKEN_EXPIRATION_DELTA;
  }

  @computed get tokenValidOrigIat(){
    // checks if tokens can still be refreshed against origin token picking time
    return this.token_original_iat !== undefined && new Date().getTime() < this.token_original_iat + TOKEN_REFRESH_EXPIRATION;
  }

  @computed get tokenShouldRefresh(){
    // checks if enough time has passed for the token to be refreshed
    return this.token_iat !== undefined && new Date().getTime() > this.token_iat + TOKEN_REFRESH_RATE;
  }

  resetToken(){
    this.token_iat = new Date().getTime();
  }

  hardResetToken(){
    this.token_iat = this.token_original_iat = new Date().getTime();
  }

  @action.bound
  isAuthenticated(){
    return this.token !== undefined && this.tokenValidIat !== undefined;
  }

  @action.bound refreshToken() {
    return axiosInstance.post(`${API_HOSTNAME}/token/refresh/`, {'refresh': this.refresh_token}).then(response => {
      this.token = response.data.access;
      this.resetToken();
      return response;
    })
      .catch((e) => {
        this.signOut();
        window.location.reload();
      });
  }

  createAxiosInstance() {
    const instance = axios.create({
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Authorization': `Bearer ${this.token}`
      }
    });

    instance.interceptors.response.use(response => {
       return response;
    }, error => {
      if (error.response.status === 401) {
        this.signOut();
        window.location.reload();
      }
      return error;
    });

    return instance;
  }

  getAxiosInstance(){
    return new Promise((resolve) => {
      if(this.tokenShouldRefresh && this.tokenValidIat){
        this.refreshToken().then(() => {
          resolve(this.createAxiosInstance());
        }).catch(e => {
          this.signOut();
          window.location.reload();
        });
      }
      else {
        if (!this.tokenValidOrigIat) {
          this.signOut();
          window.location.reload();
        }
        resolve(this.createAxiosInstance());
      }
    });
  }

  login(user, password){
    return axiosInstance.post(`${API_HOSTNAME}/token/auth/`, {
      'username': user,
      'password': password,
    }).then((response) => {
      if (response.status === 200) {
        this.token = response.data.access;
        this.refresh_token = response.data.refresh;
        this.hardResetToken();
      }
      return response;
    });
  }

  signOut(){
    this.token = undefined;
    this.refresh_token = undefined;
    this.token_iat = undefined;
    this.token_original_iat = undefined;
    // FIXME: should be independent from the root store
    this.root.signOut();
  }

  @action.bound
  autologin(){
    // Only refresh if we have both tokens and token hasn't fully expired
    if(this.token && this.refresh_token && new Date().getTime() < this.token_original_iat + TOKEN_EXPIRATION_DELTA){
      // Only actually refresh if it's time to (TOKEN_REFRESH_RATE has passed)
      if(this.tokenShouldRefresh){
        return this.refreshToken();
      }
      // Otherwise just return success, token is still valid
      return Promise.resolve();
    }
    else{
      this.signOut();
      return null;
    }
  }
}
