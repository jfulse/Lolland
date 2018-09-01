import React from 'react';
import { inject, observer } from 'mobx-react';
import { configure } from 'mobx';
import { apiClient } from 'mobx-rest';
import createAdapter from 'mobx-rest-axios-adapter';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { compose, lifecycle } from 'recompose';
import queryString from 'query-string';

import { Categories, GuessArtist, Header } from './components';
import { waitForUserProfile } from './enhancers';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// TOTO: Get from .env
const SERVER_URL = 'http://localhost:8888';

configure({ enforceActions: 'observed' });

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Categories} />
      <Route exact path="/guess-artist" component={GuessArtist} />
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
      access_token: accessToken,
      refresh_token: refreshToken,
    } = queryString.parse(hash);

    if (accessToken) {
      setToken(accessToken);
      setRefreshToken(refreshToken);
      push('/');

      const axiosAdapter = createAdapter(axios);
      apiClient(axiosAdapter, {
        apiPath: SPOTIFY_API_URL,
        commonOptions: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      await user.fetch();

      this.forceUpdate();
    } else {
      console.log('Access token not found; redirecting to login');
      window.location.replace(`${SERVER_URL}/login`);
    }
  },
});

export default compose(
  inject('route'),
  inject('auth'),
  inject('user'),
  observer,
  initialise,
  waitForUserProfile,
)(App);
