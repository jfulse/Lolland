import { Collection, Model } from 'mobx-rest';
import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

import { random } from '../utils';

class Playlist extends Model {}

class Playlists extends Collection {
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
    return '/me/playlists';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  async get(id) {
    const { token } = this.auth;
    let playlist = null;
    if (!id) {
      // eslint-disable-next-line prefer-destructuring
      playlist = this.models[random(this.models.length)];
    } else {
      playlist = (this.models || []).find(({ id: artistId }) => id === artistId);
      if (!playlist) {
        const { data } = await axios({
          url: `${this.spotifyUrl}/playlists/${id}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        playlist = data;
      }
    }
    const { tracks: { href } } = playlist;
    const { data } = await axios({
      url: href,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    runInAction(() => {
      playlist.tracks = data;
    });
    return playlist;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Playlist;
  }
}

decorate(Playlists, {
  total: observable,
  setTotal: action,
  get: action,
});

export default Playlists;
