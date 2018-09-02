import {
  action, decorate, observable, runInAction,
} from 'mobx';

class Game {
  constructor() {
    runInAction(() => {
      this.category = null;
      this.current = null;
    });

    this.setCategory = this.setCategory.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
  }

  setCategory(category) {
    this.category = category;
  }

  setCurrent(current) {
    this.current = current;
  }
}

decorate(Game, {
  category: observable,
  current: observable,
  setCategory: action,
  setCurrent: action,
});

export default new Game();
