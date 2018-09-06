import PropTypes from 'prop-types';

import { categoryTypes, itemTypes, resultTypes } from '../constants';

const GameState = PropTypes.shape({
  solutions: PropTypes.arrayOf(PropTypes.string),
  answer: PropTypes.string,
  result: PropTypes.oneOf(Object.keys(resultTypes)).isRequired,
  fromItem: PropTypes.shape({}).isRequired,
  showAnswer: PropTypes.bool.isRequired,
});

const CurrentGame = PropTypes.shape({
  category: PropTypes.oneOf(Object.keys(categoryTypes)).isRequired,
  type: PropTypes.shape({
    from: PropTypes.oneOf(Object.keys(itemTypes)),
    to: PropTypes.oneOf(Object.keys(itemTypes)),
  }).isRequired,
  correctAnswers: PropTypes.number.isRequired,
  wrongAnswers: PropTypes.number.isRequired,
  state: GameState.isRequired,
  history: PropTypes.arrayOf(GameState).isRequired,
});

export default PropTypes.shape({
  currentGame: CurrentGame.isRequired,
  pastGames: PropTypes.arrayOf(CurrentGame).isRequired,
  setTypeFrom: PropTypes.func.isRequired,
  setTypeTo: PropTypes.func.isRequired,
  getRandomFrom: PropTypes.func.isRequired,
  submitGuess: PropTypes.func.isRequired,
  reveal: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
});
