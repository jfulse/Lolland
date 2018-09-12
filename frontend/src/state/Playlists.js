import axios from 'axios';

import Collection from './Collection';

class Playlists extends Collection {
  constructor(auth, spotifyUrl) {
    super(auth, spotifyUrl);
    this.getTracks = this.getTracks.bind(this);
  }

  name() { // eslint-disable-line class-methods-use-this
    return 'playlists';
  }

  async getTracks(playlist) {
    const { token } = this.auth;
    const { tracks: { href } } = playlist;
    const { data: { items } } = await axios({
      url: href,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return items;
  }

  async processItem(item) {
    const tracks = await this.getTracks(item);
    return Object.assign({}, item, { tracks });
  }
}

export default Playlists;
