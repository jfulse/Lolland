import {
  action, decorate, observable, runInAction,
} from 'mobx';

class Auth {
  constructor() {
    runInAction(() => {
      this.token = null;
      this.refreshToken = null;
    });

    this.setToken = this.setToken.bind(this);
    this.setRefreshToken = this.setRefreshToken.bind(this);
  }

  setToken(token) {
    this.token = token;
  }

  setRefreshToken(token) {
    this.refreshToken = token;
  }
}

decorate(Auth, {
  token: observable,
  setToken: action,
  setRefreshToken: action,
});

export default Auth;
