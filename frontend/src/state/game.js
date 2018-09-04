import {
  action, decorate, observable, runInAction,
} from 'mobx';
import { categoryTypes, resultTypes } from '../constants';

const defaultGameState = {
  category: categoryTypes.QUIZ,
  type: { from: null, to: null },
  correctAnswers: 0,
  wrongAnswers: 0,
  state: {
    solution: null,
    answer: null,
    result: resultTypes.PENDING,
  },
  history: [],
};

class Game {
  constructor() {
    runInAction(() => {
      this.currentGame = defaultGameState;
      this.pastGames = [];
    });

    this.setCategory = this.setCategory.bind(this);
    this.setTypeFrom = this.setTypeFrom.bind(this);
    this.setTypeTo = this.setTypeTo.bind(this);
  }

  setCategory(category) {
    this.currentGame.category = category;
  }

  setTypeFrom(from) {
    console.log('setTypeFrom', from);
    this.currentGame.type.from = from;
    console.log('this.currentGame', this.currentGame);
  }

  setTypeTo(to) {
    console.log('setTypeTo', to);
    this.currentGame.type.to = to;
    console.log('this.currentGame', this.currentGame);
  }
}

decorate(Game, {
  currentGame: observable,
  pastGames: observable,
  setCategory: action,
  setTypeFrom: action,
  setTypeTo: action,
});

export default Game;
