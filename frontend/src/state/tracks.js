import { Collection, Model } from 'mobx-rest';
import { runInAction } from 'mobx';

import { random } from '../utils';

class Track extends Model {}

class Tracks extends Collection {
  url() { // eslint-disable-line class-methods-use-this
    return '/me/tracks';
  }

  set({ items }) {
    runInAction(() => {
      this.models = items;
    });
  }

  get(id) { // eslint-disable-line class-methods-use-this
    if (!id) {
      const nTracks = this.models.length;
      const idx = random(nTracks);
      return this.models[idx].track;
    }
    console.error('get by id not implemented yet!');
    return null;
  }

  model() { // eslint-disable-line class-methods-use-this
    return Track;
  }
}

export default new Tracks();
