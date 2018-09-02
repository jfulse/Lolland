import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';

import { categoryTypes } from '../../constants';
import { Game, Route } from '../../propTypes';

const CategoriesWrapper = styled.div`
  font-size: 12px;
  text-align: center;
`;

const Categories = ({ game: { setCategory }, route: { push } }) => (
  <CategoriesWrapper>
    <h2>Choose category:</h2>
    <button
      onClick={() => {
        setCategory(categoryTypes.GUESS_ARTIST);
        push('/guess-artist');
      }}
      type="button"
      role="link"
    >
      Guess artist
    </button>
  </CategoriesWrapper>
);

Categories.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  observer,
)(Categories);
