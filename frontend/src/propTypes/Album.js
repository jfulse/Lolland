import PropTypes from 'prop-types';

import Artist from './Artist';
import { albumTypes } from '../constants';

export default PropTypes.shape({
  name: PropTypes.string.isRequired,
  release_date: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  artists: PropTypes.arrayOf(Artist).isRequired,
  uri: PropTypes.string.isRequired,
  album_type: PropTypes.oneOf(Object.keys(albumTypes)),
});
