import Collection from './Collection';

class Albums extends Collection {
  name() { // eslint-disable-line class-methods-use-this
    return 'albums';
  }
}

export default Albums;
