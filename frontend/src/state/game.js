import {
  action, decorate, observable, runInAction,
} from 'mobx';
import axios from 'axios';

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

const formatAnswer = string => string.toLowerCase().replace(/^ ?the/, '').replace(/['!?´`"]/, '');

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
  constructor(auth, albums, tracks, playlists) {
    runInAction(() => {
      this.currentGame = defaultGame;
      this.pastGames = [];
    });

    this.auth = auth;
    this.albums = albums;
    this.tracks = tracks;
    this.playlists = playlists;

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
    if (to === itemTypes.PLAYLIST) {
      if (from === itemTypes.TRACK) {
        const { token } = this.auth;
        const playlist = await randomItem(this.playlists);
        const { tracks: { href }, name } = playlist;
        const { data: { items } } = await axios({
          url: href,
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const { track } = items[random(items.length)];

        runInAction(() => {
          this.currentGame.state.solutions = [formatAnswer(name)];
          this.currentGame.state.fromItem = track;
        });
      } else {
        console.error('Can only guess playlist from track');
      }
    } else if (from === itemTypes.ALBUM) {
      const album = await randomItem(this.albums);
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = album.artists.map(({ name }) => formatAnswer(name));
          this.currentGame.state.fromItem = album;
        });
      } else {
        console.error('Game: guessing ', to, 'from album not implemented');
      }
    } else if (from === itemTypes.TRACK) {
      const track = await randomItem(this.tracks);
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = track.artists.map(({ name }) => formatAnswer(name));
          this.currentGame.state.fromItem = track;
        });
      } else if (to === itemTypes.ALBUM) {
        runInAction(() => {
          this.currentGame.state.solutions = [formatAnswer(track.album.name)];
          this.currentGame.state.fromItem = track;
        });
      } else {
        console.error('Game: guessing ', to, 'from track not implemented');
      }
    } else {
      console.error('Game: guessing from ', from, 'not implemented');
    }
  }

  submitGuess(answer) {
    const { currentGame } = this;
    const { state } = currentGame;
    state.answer = answer;

    const correct = state.solutions.includes(formatAnswer(answer));
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
