import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LandingWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 50px;
`;

const LinkButton = styled(Link)`
  border: 1px solid black;
  border-radius: 5px;
  text-decoration: none;
  padding: 5px;
  margin: 5px;
  color: black;

  &:hover {
    cursor: pointer;
    filter: brightness(85%);
    color: darkgray;
  }
`;

const Landing = () => (
  <LandingWrapper>
    <LinkButton to="/setup">
      Setup game
    </LinkButton>
    <LinkButton to="/favourites">
      Favourites
    </LinkButton>
  </LandingWrapper>
);

export default Landing;
