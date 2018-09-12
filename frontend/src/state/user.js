import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

class User {
  constructor(auth, spotifyUrl) {
    this.auth = auth;
    this.spotifyUrl = spotifyUrl;

    runInAction(() => {
      this.profile = null;
    });

    this.get = this.get.bind(this);
  }

  async get() { // eslint-disable-line class-methods-use-this
    const { token } = this.auth;
    const url = `${this.spotifyUrl}/me`;
    if (this.profile) {
      return this.profile;
    }
    const { data } = await axios({
      url,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    runInAction(() => {
      this.profile = data;
    });
    return data;
  }
}

decorate(User, {
  profile: observable,
  get: action,
});

export default User;
