import { Collection, Model } from 'mobx-rest';
import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

import { random } from '../utils';

class Artist extends Model {}

class Artists extends Collection {
  constructor(auth, spotifyUrl) {
    super();
    this.auth = auth;
    this.spotifyUrl = spotifyUrl;

    runInAction(() => {
      this.total = null;
    });

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.setTotal = this.setTotal.bind(this);
  }

  setTotal(total) {
    this.total = total;
  }

  url() { // eslint-disable-line class-methods-use-this
    return '/me/artists';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  async get(id) {
    let artist = null;
    if (!id) {
      const nArtists = this.models.length;
      const idx = random(nArtists);
      artist = this.models[idx].artist; // eslint-disable-line prefer-destructuring
    } else {
      artist = (this.models || []).find(({ id: artistId }) => id === artistId);
      if (!artist) {
        const { token } = this.auth;
        const { data } = await axios({
          url: `${this.spotifyUrl}/artists/${id}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        artist = data;
      }
    }
    const albums = await this.getAlbums(artist);
    artist.albums = albums;
    return artist;
  }

  async getAlbums(artist) {
    const { token } = this.auth;
    const { name } = artist;
    const { data: { albums: { items } } } = await axios({
      url: `${this.spotifyUrl}/search`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: `artist:${name}`,
        type: 'album',
      },
    });
    return items;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Artist;
  }
}

decorate(Artists, {
  total: observable,
  setTotal: action,
});

export default Artists;
