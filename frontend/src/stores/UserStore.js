import {action, computed, observable} from "mobx";
import {API_HOSTNAME} from "../config";

export default class UserStore {
  @observable root;
  @observable profileID;
  @observable userID;
  @observable first_name;
  @observable last_name;
  @observable nickname;
  role;
  @observable charactersCount;

  constructor(root) {
    this.root = root;
  }

  @computed get api(){
    return this.root.api;
  }

  @computed get isDM(){
    return this.role === 'Dungeon Master';
  }

  @action.bound
  fetchData(){
    return this.root.api.get(`/current_user/`)
      .then((response) => {
        const data = response.data;
        this.profileID = data.id;
        this.userID = data.user.id;
        this.first_name = data.user.first_name;
        this.last_name = data.user.last_name;
        this.nickname = data.nickname;
        this.role = data.role;
        this.charactersCount = data.characters_count;
      })
      .catch((err) => {
        this.root.signOut();
      });
  }

  @action.bound
  saveData(){
    return this.api.put(`/current_user/`,
      {
        'id': this.profileID,
        'user': {
          'first_name': this.first_name,
          'last_name': this.last_name,
        },
        'nickname': this.nickname,
    }).catch((err) => {
      this.root.signOut();
    });
  }
}
