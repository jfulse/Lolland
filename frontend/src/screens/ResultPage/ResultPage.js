import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { Game } from '../../propTypes';

const ResultPage = ({ game: { currentGame: { correctAnswers, wrongAnswers } } }) => (
  <div>
    {correctAnswers}
    {' / '}
    {correctAnswers + wrongAnswers}
    {' correct'}
  </div>
);

ResultPage.propTypes = {
  game: Game.isRequired,
};

export default compose(
  inject('game'),
  observer,
)(ResultPage);
