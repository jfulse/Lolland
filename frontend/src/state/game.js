import {
  action, decorate, observable, runInAction,
} from 'mobx';

class Game {
  constructor() {
    runInAction(() => {
      this.category = null;
      this.current = null;
      this.showAnswer = false;
    });

    this.setCategory = this.setCategory.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setShowAnswer = this.setShowAnswer.bind(this);
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
}

decorate(Game, {
  category: observable,
  current: observable,
  showAnswer: observable,
  setCategory: action,
  setCurrent: action,
  setShowAnswer: action,
});

export default new Game();
