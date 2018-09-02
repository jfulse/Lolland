import PropTypes from 'prop-types';

export default PropTypes.shape({
  category: PropTypes.string, // TODO: Enum
  current: PropTypes.shape({
    from: PropTypes.string,
  }),
  setCategory: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
});
