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

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const STORAGE_TOKEN = 'lolland-token';

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
      auth: { setToken, setRefreshToken },
      route: { location: { hash }, push },
      user,
    } = this.props;
    const {
      access_token: hashToken,
      refresh_token: refreshToken,
    } = queryString.parse(hash);
    let token;

    if (hashToken) {
      token = hashToken;
      setRefreshToken(refreshToken);
      push('/');
    } else {
      token = localStorage.getItem(STORAGE_TOKEN);
    }

    if (token) {
      runInAction(() => localStorage.setItem(STORAGE_TOKEN, token));
      setToken(token);

      const axiosAdapter = createAdapter(axios);
      apiClient(axiosAdapter, {
        apiPath: SPOTIFY_API_URL,
        commonOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      await user.fetch();

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
  observer,
  initialise,
)(App);
