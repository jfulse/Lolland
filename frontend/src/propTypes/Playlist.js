import PropTypes from 'prop-types';

import Track from './Track';

export default PropTypes.shape({
  name: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      track: Track,
    }),
  ).isRequired,
  uri: PropTypes.string.isRequired,
});
