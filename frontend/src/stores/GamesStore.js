import {computed, observable} from 'mobx';
import {fullDateToString, dateToString, weekdayOf} from "../utils";
import Api from "../api";

export default class GamesStore {
  @observable root = null;

  constructor(root){
    this.root = root;
  }

  @computed get api(){
    return this.root.api;
  }

  fetch(){
    return this.api.fetchData('games/list');
  }

  fetchFuture(){
    return this.api.fetchData('games/future');
  }

  fetchPast(extraParams){
    return this.api.fetchData('games/past', `ordering=-date,-time_end,-time_end&${extraParams}`);
  }

  fetchFutureForUser(id){
    return this.api.get(`/games/future/?having_player=${id}`).then(response => response.data);
  }

  fetchFutureForDM(id){
    return this.api.get(`/games/future/?dm__id=${id}`).then(response => response.data);
  }

  fetchNotReportedForDM(id){
    return this.api.get(`/games/past/?dm__id=${id}&reported=false`).then(response => response.data);
  }

  fetchFutureForCurrentUser(){
    return this.fetchFutureForUser(this.root.currentUser.profileID);
  }

  fetchFutureForCurrentDM(){
    return this.fetchFutureForDM(this.root.currentUser.profileID);
  }

  fetchNotReportedForCurrentDM(){
    return this.fetchNotReportedForDM(this.root.currentUser.profileID);
  }

  get(id){
    return this.api.getData('games/list', id);
  }

  book(id, data){
    return this.api.putData('games/booking', id, data);
  }

  cancel(id){
    return this.api.get(`/games/booking/${id}/cancel/`);
  }

  signUp(id, characterId){
    return this.api.putData('games/list', `${id}/signUp`, {character_id: characterId})
  }

  signOut(id){
    return this.api.putData('games/list', `${id}/signOut`, {})
  }

  sendReport(id, data){
    return this.api.putData('games/list', `${id}/report`, data)
  }

  static getDMName(game) {
    if(!game.dm) return '';
    return `${game.dm.first_name} ${game.dm.last_name} (${game.dm.nickname})`;
  }

  static getWeekDay(game) {
    const date = new Date(game.date);
    return weekdayOf(date);
  }

  static getDateString(game) {
    if(!game.date) return '';
    const date = new Date(game.date);
    return dateToString(date);
  }

  static getFullDateString(game) {
     if(!game.date) return '';
     const date = new Date(game.date);
     return fullDateToString(date);
  }
}
