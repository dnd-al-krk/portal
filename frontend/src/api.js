import {API_HOSTNAME} from "./config";


export default class Api {
  auth;

  constructor(auth){
    this.auth = auth;
  }

  get(url){
    return this.auth.getAxiosInstance().then(instance => instance.get(`${API_HOSTNAME}${url}`));
  }

  post(url, data){
    return this.auth.getAxiosInstance().then(instance => instance.post(`${API_HOSTNAME}${url}`, data));
  }

  put(url, data){
    return this.auth.getAxiosInstance().then(instance => instance.put(`${API_HOSTNAME}${url}`, data));
  }


  fetchData(name, params=''){
    return this.get(`/${name}/?${params}`).then(response => response.data);
  }

  getData(name, id){
    return this.get(`/${name}/${id}/`).then(response => response.data);
  }

  putData(name, id, data){
    return this.put(`/${name}/${id}/`, data).then(response => response.data);
  }
}
