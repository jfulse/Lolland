import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

class Player {
  constructor(auth, spotifyUrl) {
    runInAction(() => {
      this.deviceId = null;
      this.playing = false;
      this.auth = auth;
      this.spotifyUrl = spotifyUrl;
    });

    this.setDeviceId = this.setDeviceId.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.setContextUri = this.setContextUri.bind(this);
    this.setUri = this.setUri.bind(this);
  }

  setDeviceId(deviceId) {
    console.log('setDeviceId', deviceId);
    this.deviceId = deviceId;
  }

  async start() {
    const { token } = this.auth;
    this.playing = true;
    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/play`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async stop() {
    const { token } = this.auth;
    this.playing = false;

    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/pause`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async setContextUri(uri) {
    const { token } = this.auth;
    this.playing = true;

    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/play`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
        data: { context_uri: uri },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async setUri(uri) {
    const { token } = this.auth;
    this.playing = true;

    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/play`,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
        data: { uris: [uri] },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

decorate(Player, {
  playing: observable,
  setDeviceId: action,
  start: action,
  stop: action,
  setContextUri: action,
  setUri: action,
});

export default Player;
