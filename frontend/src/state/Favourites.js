import {
  action, decorate, observable, runInAction,
} from 'mobx';
import localStorage from 'mobx-localstorage';

import { itemTypes } from '../constants';

const storageKeys = {
  [itemTypes.ARTIST]: 'LOLLAND_FAVOURITE_ARTISTS',
  [itemTypes.ALBUM]: 'LOLLAND_FAVOURITE_ALBUMS',
  [itemTypes.TRACK]: 'LOLLAND_FAVOURITE_TRACKS',
};

class Favourites {
  constructor() {
    runInAction(() => {
      this.artists = [];
      this.albums = [];
      this.tracks = [];
    });

    this.getItems = this.getItems.bind(this);
    this.setItems = this.setItems.bind(this);
    this.setFavourite = this.setFavourite.bind(this);
    this.unSetFavourite = this.unSetFavourite.bind(this);
    this.isFavourite = this.isFavourite.bind(this);
    this.persist = this.persist.bind(this);
    this.populateFromStore = this.populateFromStore.bind(this);
  }

  getItems(itemType) {
    switch (itemType) {
      case itemTypes.ARTIST:
        return this.artists;
      case itemTypes.ALBUM:
        return this.albums;
      case itemTypes.TRACK:
        return this.tracks;
      default:
        return null;
    }
  }

  setItems(itemType, items) {
    switch (itemType) {
      case itemTypes.ARTIST:
        this.artists = items;
        break;
      case itemTypes.ALBUM:
        this.albums = items;
        break;
      case itemTypes.TRACK:
        this.tracks = items;
        break;
      default:
        break;
    }
  }

  setFavourite(itemType, item) {
    const itemList = this.getItems(itemType);
    itemList.push(item);
    this.persist(itemType);
  }

  unSetFavourite(itemType, item) {
    const itemList = this.getItems(itemType);
    this.setItems(itemType, itemList.filter(({ uri }) => uri !== item.uri));
    this.persist(itemType);
  }

  isFavourite(itemType, item) {
    const itemList = this.getItems(itemType);
    return itemList.findIndex(({ uri }) => uri === item.uri) > -1;
  }

  persist(itemTypeList) {
    const list = Array.isArray(itemTypeList) ? itemTypeList : [itemTypeList];
    list.forEach((itemType) => {
      const items = this.getItems(itemType);
      localStorage.setItem(storageKeys[itemType], items);
    });
  }

  populateFromStore() {
    this.artists = localStorage.getItem(storageKeys[itemTypes.ARTIST]) || [];
    this.albums = localStorage.getItem(storageKeys[itemTypes.ALBUM]) || [];
    this.tracks = localStorage.getItem(storageKeys[itemTypes.TRACK]) || [];
  }
}


decorate(Favourites, {
  artists: observable,
  albums: observable,
  tracks: observable,
  setFavourite: action,
  unSetFavourite: action,
  populateFromStore: action,
});

export default Favourites;
