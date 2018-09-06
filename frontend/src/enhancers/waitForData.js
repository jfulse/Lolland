import { branch, renderComponent } from 'recompose';
import at from 'lodash.at';

import { Loader } from '../components';

export default paths => branch(
  props => at(props, paths).some(prop => prop == null),
  renderComponent(Loader),
);
