import { Collection, Model } from 'mobx-rest';
import { runInAction } from 'mobx';

class Album extends Model {}

class Albums extends Collection {
  url() { // eslint-disable-line class-methods-use-this
    return '/me/albums';
  }

  set({ items }) {
    console.log('set items', items);
    runInAction(() => {
      this.models = items;
    });
  }

  get(id) { // eslint-disable-line class-methods-use-this
    if (!id) {
      const nAlbums = this.models.length;
      const idx = Math.floor(Math.random() * nAlbums);
      console.log('will return ', this.models[idx].album);
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
