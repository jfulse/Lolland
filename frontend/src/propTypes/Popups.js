import PropTypes from 'prop-types';

export default PropTypes.shape({
  isOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  props: PropTypes.shape({}).isRequired,
  openPopup: PropTypes.func.isRequired,
  closePopup: PropTypes.func.isRequired,
});
