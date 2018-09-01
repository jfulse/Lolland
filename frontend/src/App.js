import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { apiClient } from 'mobx-rest';
import createAdapter from 'mobx-rest-axios-adapter';
import axios from 'axios';
import {
  branch, compose, lifecycle, renderComponent, withState,
} from 'recompose';
import queryString from 'query-string';

import { Loader } from './components';

// TODO: Get from .env
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const App = ({ userProfile }) => (
  <div>
    <strong>User:</strong>
    <br />
    <ul>
      {Object.entries(userProfile).map(([key, value]) => (
        <li key={key} style={{ listStyle: 'none', margin: '5px' }}>
          <i>{key}</i>
          :&nbsp;&nbsp;
          {value}
        </li>
      ))}
    </ul>
  </div>
);

App.propTypes = {
  userProfile: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

const withInitialise = lifecycle({
  async componentDidMount() {
    const {
      auth: { setToken, setRefreshToken },
      route: { location: { hash } },
      user,
      setUserProfile,
    } = this.props;
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = queryString.parse(hash);

    setToken(accessToken);
    setRefreshToken(refreshToken);

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

    setUserProfile({
      email: user.get('email'),
      name: user.get('id'),
      account: user.get('product'),
      country: user.get('country'),
      followers: user.get('followers').total,
    });
  },
});

export default compose(
  inject('route'),
  inject('auth'),
  inject('user'),
  observer,
  withState('userProfile', 'setUserProfile', null),
  withInitialise,
  branch(
    ({ userProfile }) => !userProfile,
    renderComponent(Loader),
  ),
)(App);
