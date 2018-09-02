import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { Choose } from '..';
import { categoryTypes } from '../../constants';
import { Game, Route } from '../../propTypes';

const Categories = ({ game: { setCategory }, route: { push } }) => (
  <Choose>
    <h2>Choose category:</h2>
    <Choose.Alternative
      onClick={() => {
        setCategory(categoryTypes.GUESS_ARTIST);
        push('/guess-artist');
      }}
      role="link"
      label="Guess artist"
    />
  </Choose>
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
