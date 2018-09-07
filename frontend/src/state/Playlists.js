import { Collection, Model } from 'mobx-rest';
import {
  action, decorate, observable, runInAction,
} from 'mobx';

import { random } from '../utils';

class Playlist extends Model {}

class Playlists extends Collection {
  constructor() {
    super();

    runInAction(() => {
      this.total = null;
    });
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

  get(id) { // eslint-disable-line class-methods-use-this
    if (!id) {
      const nPlaylists = this.models.length;
      const idx = random(nPlaylists);
      return this.models[idx];
    }
    console.error('get by id not implemented yet!');
    return null;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Playlist;
  }
}

decorate(Playlists, {
  total: observable,
  setTotal: action,
});

export default Playlists;
