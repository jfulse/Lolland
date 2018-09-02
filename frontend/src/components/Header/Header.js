import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { waitForModels } from '../../enhancers';
import { Model } from '../../propTypes';

const HeaderWrapper = styled.div`
  font-size: 13px;
  text-align: center;
  border: 1px solid black;
`;

const Header = ({ user }) => (
  <HeaderWrapper>
    <h1>
      {user.get('id')}
    </h1>
  </HeaderWrapper>
);

Header.propTypes = {
  user: Model.isRequired,
};

export default compose(
  inject('user'),
  observer,
  waitForModels('user.id'),
)(Header);
