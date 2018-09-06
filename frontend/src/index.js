import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router-dom';

import App from './App';
import {
  Player, Albums, Auth, Game, Tracks, User,
} from './state';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const documentElement = document.getElementById('ReactApp');

if (!documentElement) {
  throw Error('React document element not found');
}

const browserHistory = createBrowserHistory();

const auth = new Auth();
const albums = new Albums();
const player = new Player(auth, SPOTIFY_API_URL);
const route = new RouterStore();
const tracks = new Tracks();
const game = new Game(albums, tracks);
const user = new User();

const stores = {
  albums,
  auth,
  game,
  player,
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
