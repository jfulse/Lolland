import PropTypes from 'prop-types';

export default PropTypes.shape({
  get: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
});
