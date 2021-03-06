import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import App from './App';
import {
  Albums, Artists, Auth, Favourites, Game, Player, Playlists, Popups, Tracks, User,
} from './state';

const documentElement = document.getElementById('ReactApp');

if (!documentElement) {
  throw Error('React document element not found');
}

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const auth = new Auth();
const albums = new Albums(auth, SPOTIFY_API_URL);
const artists = new Artists(auth, SPOTIFY_API_URL);
const playlists = new Playlists(auth, SPOTIFY_API_URL);
const tracks = new Tracks(auth, SPOTIFY_API_URL);
const favourites = new Favourites();
const player = new Player(auth, SPOTIFY_API_URL);
const popups = new Popups();
const route = new RouterStore();
const game = new Game(albums, tracks, playlists, route);
const user = new User(auth, SPOTIFY_API_URL);

const stores = {
  albums,
  artists,
  auth,
  favourites,
  game,
  player,
  playlists,
  popups,
  route,
  tracks,
  user,
};

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, route);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App spotifyUrl={SPOTIFY_API_URL} />
    </Router>
  </Provider>,
  documentElement,
);
