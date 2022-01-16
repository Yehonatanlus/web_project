import axios from 'axios';

function useToken() {

  function getToken() {
    const userToken = localStorage.getItem('token');
    return userToken
  }

  function setToken(userToken: string) {
    localStorage.setItem('token', userToken);
  };

  function removeToken() {
    localStorage.removeItem("token");
  }

  return {
    setToken,
    getToken,
    removeToken
  }

}

export default useToken;