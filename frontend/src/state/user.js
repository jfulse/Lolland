import { Model } from 'mobx-rest';

class User extends Model {
  // eslint-disable-next-line class-methods-use-this
  url() {
    return '/me';
  }
}

export default new User();
