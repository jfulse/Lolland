import PropTypes from 'prop-types';

import Album from './Album';

export default PropTypes.shape({
  album: Album.isRequired,
  name: PropTypes.string.isRequired,
  artists: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
});
