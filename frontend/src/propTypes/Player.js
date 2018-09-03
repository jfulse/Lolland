import PropTypes from 'prop-types';

export default PropTypes.shape({
  playing: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  setContextUri: PropTypes.func.isRequired,
});
