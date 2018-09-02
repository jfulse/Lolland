import {
  action, decorate, observable, runInAction,
} from 'mobx';

class Game {
  constructor() {
    runInAction(() => {
      this.category = null;
      this.current = null;
      this.showAnswer = false;
      this.nCorrect = 0;
      this.nWrong = 0;
    });

    this.setCategory = this.setCategory.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setShowAnswer = this.setShowAnswer.bind(this);
    this.increaseCorrect = this.increaseCorrect.bind(this);
    this.increaseWrong = this.increaseWrong.bind(this);
  }

  setCategory(category) {
    this.category = category;
  }

  setCurrent(current) {
    this.current = current;
  }

  setShowAnswer(showAnswer) {
    this.showAnswer = showAnswer;
  }

  increaseCorrect() {
    this.nCorrect += 1;
  }

  increaseWrong() {
    this.nWrong += 1;
  }
}

decorate(Game, {
  category: observable,
  current: observable,
  showAnswer: observable,
  nCorrect: observable,
  nWrong: observable,
  setCategory: action,
  setCurrent: action,
  setShowAnswer: action,
  increaseCorrect: action,
  increaseWrong: action,
});

export default new Game();
