import { Collection, Model } from 'mobx-rest';
import { runInAction } from 'mobx';

import { random } from '../utils';

class Album extends Model {}

class Albums extends Collection {
  url() { // eslint-disable-line class-methods-use-this
    return '/me/albums';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  get(id) { // eslint-disable-line class-methods-use-this
    if (!id) {
      const nAlbums = this.models.length;
      const idx = random(nAlbums);
      return this.models[idx].album;
    }
    console.error('get by id not implemented yet!');
    return null;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Album;
  }
}

export default new Albums();
