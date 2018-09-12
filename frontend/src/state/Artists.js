import axios from 'axios';

import Collection from './Collection';

class Artists extends Collection {
  constructor(auth, spotifyUrl) {
    super(auth, spotifyUrl);
    this.getAlbums = this.getAlbums.bind(this);
  }

  name() { // eslint-disable-line class-methods-use-this
    return 'artists';
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

  async processItem(item) {
    const albums = await this.getAlbums(item);
    return Object.assign({}, item, { albums });
  }
}

export default Artists;
