import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Pause } from '..';
import { waitForData } from '../../enhancers';
import { User } from '../../propTypes';

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

const Header = ({ user: { profile } }) => (
  <StyledHeader>
    <LeftWrapper>
      <HomeButton />
      <Pause />
    </LeftWrapper>
    {profile.id}
    <FavouritesButton />
  </StyledHeader>
);

Header.propTypes = {
  user: User.isRequired,
};

export default compose(
  inject('user'),
  waitForData('user.profile'),
  observer,
)(Header);
