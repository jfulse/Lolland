import {
  action, decorate, observable, runInAction,
} from 'mobx';

import { categoryTypes, itemTypes, resultTypes } from '../constants';
import { random } from '../utils';

const randomItem = async (collection) => {
  let { total } = collection;
  if (!total) {
    const { total: fetchedTotal } = await collection.fetch();
    total = fetchedTotal;
    collection.setTotal(fetchedTotal);
  }
  const offset = random(total);
  const baseUrl = collection.url();
  const urlWithQuery = `${baseUrl}/?offset=${offset}`;
  collection.url = () => urlWithQuery; // eslint-disable-line no-param-reassign
  await collection.fetch();
  collection.url = () => baseUrl; // eslint-disable-line no-param-reassign
  const item = collection.get();
  return item;
};

const defaultState = {
  solutions: [],
  answer: null,
  result: resultTypes.PENDING,
  fromItem: {},
  showAnswer: false,
};

const defaultGame = {
  category: categoryTypes.QUIZ,
  type: { from: null, to: null },
  correctAnswers: 0,
  wrongAnswers: 0,
  state: defaultState,
  history: [],
};

class Game {
  constructor(albums, tracks) {
    runInAction(() => {
      this.currentGame = defaultGame;
      this.pastGames = [];
    });

    this.albums = albums;
    this.tracks = tracks;

    this.setTypeFrom = this.setTypeFrom.bind(this);
    this.setTypeTo = this.setTypeTo.bind(this);
    this.getRandomFrom = this.getRandomFrom.bind(this);
    this.submitGuess = this.submitGuess.bind(this);
    this.reveal = this.reveal.bind(this);
    this.next = this.next.bind(this);
  }

  setTypeFrom(from) {
    this.currentGame.type.from = from;
  }

  setTypeTo(to) {
    this.currentGame.type.to = to;
  }

  async getRandomFrom() {
    const { type: { from, to } } = this.currentGame;
    if (from === itemTypes.ALBUM) {
      const album = await randomItem(this.albums);
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = album.artists.map(({ name }) => name.toLowerCase());
          this.currentGame.state.fromItem = album;
        });
      } else {
        console.error('Game: guessing ', to, 'from album not implemented');
      }
    }
    if (from === itemTypes.TRACK) {
      const track = await randomItem(this.tracks);
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = track.artists.map(({ name }) => name.toLowerCase());
          this.currentGame.state.fromItem = track;
        });
      } else {
        console.error('Game: guessing ', to, 'from track not implemented');
      }
    }
  }

  submitGuess(answer) {
    const { currentGame } = this;
    const { state } = currentGame;
    state.answer = answer;

    const correct = state.solutions.includes(answer.toLowerCase());
    if (correct) {
      state.result = resultTypes.CORRECT;
      state.showAnswer = true;
    } else {
      state.result = resultTypes.WRONG;
      state.showAnswer = true;
    }
  }

  reveal() {
    this.currentGame.state.showAnswer = true;
  }

  next() {
    const { currentGame, getRandomFrom } = this;

    if ([resultTypes.PENDING, resultTypes.WRONG].includes(currentGame.state.result)) {
      currentGame.wrongAnswers += 1;
    } else if (currentGame.state.result === resultTypes.CORRECT) {
      currentGame.correctAnswers += 1;
    }

    currentGame.state = defaultState;
    getRandomFrom();
  }
}

decorate(Game, {
  currentGame: observable,
  pastGames: observable,
  setTypeFrom: action,
  setTypeTo: action,
  getRandomFrom: action,
  submitGuess: action,
  reveal: action,
  next: action,
});

export default Game;
