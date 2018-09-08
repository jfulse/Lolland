import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import App from './App';
import {
  Albums, Auth, Favourites, Game, Player, Playlists, Popups, Tracks, User,
} from './state';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const documentElement = document.getElementById('ReactApp');

if (!documentElement) {
  throw Error('React document element not found');
}

const browserHistory = createBrowserHistory();

const auth = new Auth();
const albums = new Albums();
const favourites = new Favourites();
const player = new Player(auth, SPOTIFY_API_URL);
const popups = new Popups();
const route = new RouterStore();
const tracks = new Tracks();
const playlists = new Playlists();
const game = new Game(auth, albums, tracks, playlists);
const user = new User();

const stores = {
  albums,
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

const history = syncHistoryWithStore(browserHistory, route);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App spotifyUrl={SPOTIFY_API_URL} />
    </Router>
  </Provider>,
  documentElement,
);
