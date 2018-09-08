import {
  action, decorate, observable, runInAction,
} from 'mobx';

class Popups {
  constructor() {
    runInAction(() => {
      this.isOpen = false;
      this.name = '';
      this.props = {};
      this.title = '';
    });

    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  openPopup(name, title, props) {
    this.isOpen = true;
    this.name = name;
    this.title = title;
    this.props = props || {};
  }

  closePopup() {
    this.isOpen = false;
    this.name = '';
    this.title = '';
    this.props = {};
  }
}

decorate(Popups, {
  isOpen: observable,
  name: observable,
  title: observable,
  props: observable,
  openPopup: action,
  closePopup: action,
});

export default Popups;
