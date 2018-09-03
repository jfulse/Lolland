import React from 'react';
import { inject, observer } from 'mobx-react';
import { configure, runInAction } from 'mobx';
import { apiClient } from 'mobx-rest';
import createAdapter from 'mobx-rest-axios-adapter';
import localStorage from 'mobx-localstorage';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import { compose, lifecycle } from 'recompose';
import queryString from 'query-string';

import { Categories, GuessArtist, Header } from './components';
import initPlayer from './initPlayer';

const STORAGE_TOKEN = 'lolland-token';
const STORAGE_REFRESH_TOKEN = 'lolland-refresh-token';

// TODO: Get from .env
const SERVER_URL = 'http://localhost:8888';

configure({ enforceActions: 'always' });

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Categories} />
      <Route path="/guess-artist" component={GuessArtist} />
    </Switch>
  </div>
);

const initialise = lifecycle({
  async componentDidMount() {
    const {
      auth: { setToken, setRefreshToken, refreshToken },
      route: { location: { hash }, push },
      user,
      spotifyUrl,
      player: { setDeviceId },
    } = this.props;
    const {
      access_token: hashToken,
      refresh_token: hashRefreshToken,
    } = queryString.parse(hash);
    let token;

    if (hashToken) {
      token = hashToken;
      setRefreshToken(hashRefreshToken);
      push('/');
    } else {
      token = localStorage.getItem(STORAGE_TOKEN);
    }

    if (token) {
      initPlayer(token, spotifyUrl, setDeviceId);
      runInAction(() => localStorage.setItem(STORAGE_TOKEN, token));
      runInAction(() => localStorage.setItem(STORAGE_REFRESH_TOKEN, hashRefreshToken));
      setToken(token);

      const axiosAdapter = createAdapter(axios);
      apiClient(axiosAdapter, {
        apiPath: spotifyUrl,
        commonOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      try {
        await user.fetch();
      } catch ({ error }) {
        if (error && error.status && error.status === 401) {
          const currentRefreshToken = refreshToken || localStorage.getItem(STORAGE_REFRESH_TOKEN);
          if (currentRefreshToken) {
            console.log('Using refresh access token', currentRefreshToken);
            const { access_token: newAccessToken } = await axios.get(
              `${SERVER_URL}/refresh_token/`,
              queryString.stringify({ refresh_token: currentRefreshToken }),
            );

            runInAction(() => localStorage.setItem(STORAGE_TOKEN, newAccessToken));
            setRefreshToken(newAccessToken);
          } else {
            console.log('Refresh access token not found; redirecting to login');
            window.location.replace(`${SERVER_URL}/login`);
          }
        }
      }

      this.forceUpdate(); // FIXME: Auto rerender on user update
    } else {
      console.log('Access token not found; redirecting to login');
      window.location.replace(`${SERVER_URL}/login`);
    }
  },
});

export default compose(
  withRouter, // Necessary to rerender on navigation
  inject('auth'),
  inject('route'),
  inject('user'),
  inject('player'),
  observer,
  initialise,
)(App);
