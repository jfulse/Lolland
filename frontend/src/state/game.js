import { action, decorate, observable } from 'mobx';

class Game {
  constructor() {
    this.category = null;

    this.setCategory = this.setCategory.bind(this);
  }

  setCategory(category) {
    this.category = category;
  }
}

decorate(Game, {
  category: observable,
  setCategory: action,
});

export default new Game();
