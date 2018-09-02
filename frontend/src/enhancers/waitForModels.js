import { branch, renderComponent } from 'recompose';

import { Loader } from '../components';
import { all } from '../utils';

const isMissingAttributes = pathArray => props => all(pathArray.map((path) => {
  const [modelName, attribute] = path.split('.');
  const hasModel = Object.keys(props).includes(modelName);
  if (!hasModel) {
    return true;
  }
  return attribute != null && !props[modelName].has(attribute);
}));

export default (paths) => {
  const pathArray = Array.isArray(paths) ? paths : [paths];

  return branch(
    isMissingAttributes(pathArray),
    renderComponent(Loader),
  );
};
