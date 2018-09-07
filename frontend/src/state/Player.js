import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

const defaultPlayState = { uri: '', hasContext: false, trackNumber: 1 };

class Player {
  constructor(auth, spotifyUrl) {
    runInAction(() => {
      this.deviceId = null;
      this.playing = defaultPlayState;
      this.paused = defaultPlayState;
      this.auth = auth;
      this.spotifyUrl = spotifyUrl;
      this.ready = false;
    });

    this.setDeviceId = this.setDeviceId.bind(this);
    this.stop = this.stop.bind(this);
    this.play = this.play.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  setDeviceId(deviceId) {
    this.deviceId = deviceId;
    this.ready = true;
  }

  async stop() {
    const { token } = this.auth;
    this.paused = this.playing;
    this.playing = defaultPlayState;

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

  async play(hasContext, uri) {
    const { token } = this.auth;
    const restParams = {
      url: `${this.spotifyUrl}/me/player/play`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      query: { device_id: this.deviceId },
    };

    if (this.paused.uri !== uri) {
      restParams.data = hasContext ? { context_uri: uri } : { uris: [uri] };
    }

    this.playing = { hasContext, uri, trackNumber: 1 };
    this.paused = defaultPlayState;

    try {
      await axios(restParams);
    } catch (err) {
      console.error(err);
    }
  }

  async next() {
    const { token } = this.auth;

    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/next`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
      });
      runInAction(() => {
        this.playing.trackNumber += 1;
      });
    } catch (err) {
      console.error(err);
    }
  }

  async previous() {
    const { token } = this.auth;

    try {
      await axios({
        url: `${this.spotifyUrl}/me/player/previous`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        query: { device_id: this.deviceId },
      });
      runInAction(() => {
        this.playing.trackNumber += 1;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

decorate(Player, {
  ready: observable,
  playing: observable,
  paused: observable,
  setDeviceId: action,
  stop: action,
  play: action,
  next: action,
  previous: action,
});

export default Player;
