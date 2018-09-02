import { branch, renderComponent } from 'recompose';

import { Loader } from '../components';
import { all } from '../utils';

const isMissingItems = pathArray => props => all(pathArray.map((modelName) => {
  const hasModel = Object.keys(props).includes(modelName);
  if (!hasModel) {
    return true;
  }
  return props[modelName].isEmpty();
}));

export default (paths) => {
  const pathArray = Array.isArray(paths) ? paths : [paths];

  return branch(
    isMissingItems(pathArray),
    renderComponent(Loader),
  );
};
