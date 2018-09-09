import { Collection, Model } from 'mobx-rest';
import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

import { random } from '../utils';

class Track extends Model {}

class Tracks extends Collection {
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
    return '/me/tracks';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  async get(id) {
    let track = null;
    if (!id) {
      // eslint-disable-next-line prefer-destructuring
      track = this.models[random(this.models.length)].track;
    } else {
      track = (this.models || []).find(({ id: trackId }) => id === trackId);
      if (!track) {
        const { token } = this.auth;
        const { data } = await axios({
          url: `${this.spotifyUrl}/tracks/${id}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        track = data;
      }
    }
    return track;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Track;
  }
}

decorate(Tracks, {
  total: observable,
  setTotal: action,
});

export default Tracks;
