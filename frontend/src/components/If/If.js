import PropTypes from 'prop-types';

import { Children } from '../../propTypes';

const If = ({ condition, children }) => {
  if (condition) {
    return children;
  }
  return null;
};

If.propTypes = {
  children: Children.isRequired,
  condition: PropTypes.bool.isRequired,
};

export default If;
