import { Collection, Model } from 'mobx-rest';
import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

import { random } from '../utils';

class Album extends Model {}

class Albums extends Collection {
  constructor(auth, spotifyUrl) {
    super();
    this.auth = auth;
    this.spotifyUrl = spotifyUrl;

    runInAction(() => {
      this.total = null;
    });

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }

  setTotal(total) {
    this.total = total;
  }

  url() { // eslint-disable-line class-methods-use-this
    return '/me/albums';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  async get(id) {
    let album = null;
    if (!id) {
      // eslint-disable-next-line prefer-destructuring
      album = this.models[random(this.models.length)].album;
    } else {
      album = (this.models || []).find(({ id: artistId }) => id === artistId);
      if (!album) {
        const { token } = this.auth;
        const { data } = await axios({
          url: `${this.spotifyUrl}/albums/${id}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        album = data;
      }
    }
    return album;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Album;
  }
}

decorate(Albums, {
  total: observable,
  setTotal: action,
});

export default Albums;
