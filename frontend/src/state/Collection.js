import axios from 'axios';

import { random } from '../utils';

class Collection {
  constructor(auth, spotifyUrl) {
    this.auth = auth;
    this.spotifyUrl = spotifyUrl;
    this.items = [];
    this.userTotal = null;

    this.get = this.get.bind(this);
    this.fetchFromUser = this.fetchFromUser.bind(this);
  }

  name() { // eslint-disable-line class-methods-use-this
    throw Error('Function "name" must be defined in extension of Collection');
  }

  processItem(item) { // eslint-disable-line class-methods-use-this
    return item;
  }

  fetchFromUser(offset) {
    const { token } = this.auth;
    const url = `${this.spotifyUrl}/me/${this.name()}${offset ? `?offset=${offset}` : ''}`;
    return axios({
      url,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async get(id) {
    const { token } = this.auth;
    let item = null;
    if (!id) {
      if (!this.userTotal) {
        const { data: { total } } = await this.fetchFromUser();
        this.userTotal = total;
      }
      const offset = random(this.userTotal);
      const { data: { items } } = await this.fetchFromUser(offset);
      item = items[random(items.length)];
    } else {
      item = this.items.find(({ id: itemId }) => id === itemId);
      if (!item) {
        const { data } = await axios({
          url: `${this.spotifyUrl}/${this.name()}/${id}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        item = data;
        this.items.push(item);
      }
    }

    item = await this.processItem(item);
    return item;
  }
}

export default Collection;
