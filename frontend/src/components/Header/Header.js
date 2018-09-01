import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { waitForUserProfile } from '../../enhancers';

const Header = ({ user }) => (
  <div style={{
    fontSize: '13px', textAlign: 'center', margin: '10px 0 40px', border: '1px solid black',
  }}
  >
    <h1>
      {user.get('id')}
    </h1>
  </div>
);

Header.propTypes = {
  user: PropTypes.shape({}).isRequired,
};

export default compose(
  inject('user'),
  observer,
  waitForUserProfile,
)(Header);
