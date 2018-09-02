import PropTypes from 'prop-types';

export default PropTypes.shape({
  name: PropTypes.string.isRequired,
  release_date: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  artists: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
});
