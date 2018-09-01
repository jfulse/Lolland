import { branch, renderComponent } from 'recompose';

import { Loader } from '../components';

export default branch(
  ({ user }) => !user.has('id') || !user.has('email'),
  renderComponent(Loader),
);
