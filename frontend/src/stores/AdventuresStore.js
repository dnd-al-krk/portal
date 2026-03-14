import {Game} from "./GamesStore";
import {computed, observable} from "mobx";


export default class AdventuresStore {
  @observable root = null;

  constructor(rootStore){
    this.root = rootStore;
  }

  @computed get api(){
    return this.root.api;
  }

  fetch(){
    this.items = [];
    return this.api.fetchData('adventures');
  }
}
