import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Pause } from '..';
import { waitForModels } from '../../enhancers';
import { Model } from '../../propTypes';

const StyledHeader = styled.h1`
  font-size: 24px;
  text-align: center;
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const LeftWrapper = styled.span`
  display: flex;
  width: 70px;
  align-items: center;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  font-size: 16px;
`;

const HomeButton = () => <StyledLink to="/">Home</StyledLink>;
const FavouritesButton = () => <StyledLink to="/favourites">Favourites</StyledLink>;

const Header = ({ user }) => (
  <StyledHeader>
    <LeftWrapper>
      <HomeButton />
      <Pause />
    </LeftWrapper>
    {user.get('id')}
    <FavouritesButton />
  </StyledHeader>
);

Header.propTypes = {
  user: Model.isRequired,
};

export default compose(
  inject('user'),
  waitForModels('user.id'),
  observer,
)(Header);
