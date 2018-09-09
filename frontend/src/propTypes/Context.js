import PropTypes from 'prop-types';

import { itemTypes } from '../constants';

export default PropTypes.shape({
  type: PropTypes.oneOf(Object.keys(itemTypes)).isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    uri: PropTypes.string,
  }).isRequired,
});
