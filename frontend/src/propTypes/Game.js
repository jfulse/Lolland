import PropTypes from 'prop-types';

export default PropTypes.shape({
  category: PropTypes.string, // TODO: Enum
  setCategory: PropTypes.func.isRequired,
});
