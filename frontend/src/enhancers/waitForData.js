import { branch, renderComponent } from 'recompose';

import { Loader } from '../components';
import { any } from '../utils';

export default (propNames) => {
  const nameList = Array.isArray(propNames) ? propNames : [propNames];

  return branch(
    props => any(nameList.map(name => !Object.keys(props).includes(name) || props[name] == null)),
    renderComponent(Loader),
  );
};
