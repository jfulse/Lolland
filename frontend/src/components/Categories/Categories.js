import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { branch, compose, renderNothing } from 'recompose';

import { categoryTypes } from '../../constants';

const Categories = ({ game: { setCategory }, route: { push } }) => (
  <div style={{ fontSize: '12px', textAlign: 'center' }}>
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
  </div>
);

Categories.propTypes = {
  game: PropTypes.shape({
    setCategory: PropTypes.func,
    category: PropTypes.string, // TODO: Enum
  }).isRequired,
  route: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  observer,
  branch(
    ({ game: { category } }) => category,
    renderNothing,
  ),
)(Categories);
