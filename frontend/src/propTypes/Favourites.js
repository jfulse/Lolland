import PropTypes from 'prop-types';

import Artist from './Artist';
import Album from './Album';
import Track from './Track';

export default PropTypes.shape({
  artists: PropTypes.arrayOf(Artist).isRequired,
  albums: PropTypes.arrayOf(Album).isRequired,
  tracks: PropTypes.arrayOf(Track).isRequired,
  setFavourite: PropTypes.func.isRequired,
  unSetFavourite: PropTypes.func.isRequired,
  isFavourite: PropTypes.func.isRequired,
  populateFromStore: PropTypes.func.isRequired,
});
