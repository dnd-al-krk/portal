let backendHost;

const working_hostname = window && window.location && window.location.hostname;

if(working_hostname === 'localhost'){
  backendHost = 'http://localhost:8000'
}
else if(working_hostname === 'https://alkrakow.toady.pl' || working_hostname === 'https://dndkrakow.pl' || working_hostname === 'https://rpgkrakow.pl') {
  backendHost = working_hostname
}
else{
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:8000';
}

export const API_HOSTNAME = `${backendHost}/api`;
