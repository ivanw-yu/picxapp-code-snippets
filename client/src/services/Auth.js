
export default class Auth{

  static isLoggedIn(){
    return localStorage.getItem('user') != undefined;
  }

  static getUser(){
    if(Auth.isLoggedIn()){
        return JSON.parse(localStorage.getItem('user'));
    }
    return null;
  }

  static setUser(user){
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUserId(){
    if(Auth.isLoggedIn()){
        const user = Auth.getUser();
        return user._id;
    }
    return null;
  }

  static getToken(){
    return localStorage.getItem('token');
  }

  static setToken(token){
    localStorage.setItem('token', token);
  }

  static logout(){
      localStorage.clear();
      window.location.pathname = "/login";
  }
}
