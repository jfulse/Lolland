import {
  action, decorate, observable, runInAction,
} from 'mobx';

import { categoryTypes, itemTypes, resultTypes } from '../constants';
import { random } from '../utils';

const formatAnswer = string => string.toLowerCase().replace(/^ ?the/, '').replace(/['!?´`"]/, '');

const defaultState = {
  solutions: [],
  answer: null,
  result: resultTypes.PENDING,
  fromItem: {},
  toItems: [],
  showAnswer: false,
};

const defaultSettings = {
  autoplay: false,
  showAlbumBackground: true,
  rounds: 5,
};

const defaultGame = {
  category: categoryTypes.QUIZ,
  type: { from: null, to: null },
  correctAnswers: 0,
  wrongAnswers: 0,
  state: defaultState,
  history: [],
  settings: defaultSettings,
  round: 1,
};

class Game {
  constructor(albums, tracks, playlists, route) {
    runInAction(() => {
      this.currentGame = defaultGame;
      this.pastGames = [];
    });

    this.albums = albums;
    this.tracks = tracks;
    this.playlists = playlists;
    this.route = route;

    this.setTypeFrom = this.setTypeFrom.bind(this);
    this.setTypeTo = this.setTypeTo.bind(this);
    this.setSettings = this.setSettings.bind(this);
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

  setSettings(settings) {
    this.currentGame.settings = settings;
  }

  async getRandomFrom() {
    const { type: { from, to } } = this.currentGame;
    if (to === itemTypes.PLAYLIST) {
      if (from === itemTypes.TRACK) {
        const playlist = await this.playlists.get();
        const { name, tracks } = playlist;
        const { track } = tracks[random(tracks.length)];

        runInAction(() => {
          this.currentGame.state.solutions = [formatAnswer(name)];
          this.currentGame.state.fromItem = track;
          this.currentGame.state.toItems = [playlist];
        });
      } else {
        console.error('Can only guess playlist from track');
      }
    } else if (from === itemTypes.ALBUM) {
      const { album } = await this.albums.get();
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = album.artists.map(({ name }) => formatAnswer(name));
          this.currentGame.state.fromItem = album;
          this.currentGame.state.toItems = album.artists;
        });
      } else {
        console.error('Game: guessing ', to, 'from album not implemented');
      }
    } else if (from === itemTypes.TRACK) {
      const { track } = await this.tracks.get();
      if (to === itemTypes.ARTIST) {
        runInAction(() => {
          this.currentGame.state.solutions = track.artists.map(({ name }) => formatAnswer(name));
          this.currentGame.state.fromItem = track;
          this.currentGame.state.toItems = track.artists;
        });
      } else if (to === itemTypes.ALBUM) {
        runInAction(() => {
          this.currentGame.state.solutions = [formatAnswer(track.album.name)];
          this.currentGame.state.fromItem = track;
          this.currentGame.state.toItems = [track.album];
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

    currentGame.round += 1;
    currentGame.state = defaultState;

    if (currentGame.round > currentGame.settings.rounds) {
      this.route.push('/result');
    } else {
      getRandomFrom();
    }
  }
}

decorate(Game, {
  currentGame: observable,
  pastGames: observable,
  setTypeFrom: action,
  setTypeTo: action,
  setSettings: action,
  getRandomFrom: action,
  submitGuess: action,
  reveal: action,
  next: action,
});

export default Game;
