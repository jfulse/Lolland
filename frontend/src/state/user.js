import { Model } from 'mobx-rest';

class User extends Model {
  url() { // eslint-disable-line class-methods-use-this
    return '/me';
  }
}

export default User;
