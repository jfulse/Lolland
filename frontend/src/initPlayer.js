/* global Spotify */
/* eslint camelcase: 0 */
import axios from 'axios';

export default (token, spotifyUrl, setDeviceId) => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Lolland Spotify Player',
      getOAuthToken: (cb) => { cb(token); },
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', (state) => { console.log('player state', state); });

    // Ready
    player.addListener('ready', async ({ device_id }) => {
      setDeviceId(device_id);

      const { data: { devices } } = await axios({
        url: `${spotifyUrl}/me/player/devices`,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const deviceIsListed = devices.findIndex(({ id }) => id === device_id) > -1;

      if (deviceIsListed) {
        await axios({
          url: `${spotifyUrl}/me/player`,
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          data: { play: false, device_ids: [device_id], token },
        });
      }
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect().then((success) => {
      console.log('Spotify player success:', success);
    });
  };
};
