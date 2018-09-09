import PropTypes from 'prop-types';

import Album from './Album';
import Artist from './Artist';
import Playlist from './Playlist';
import Track from './Track';

export default PropTypes.shape({
  albums: PropTypes.arrayOf(Album).isRequired,
  artists: PropTypes.arrayOf(Artist).isRequired,
  playlists: PropTypes.arrayOf(Playlist).isRequired,
  tracks: PropTypes.arrayOf(Track).isRequired,
  setFavourite: PropTypes.func.isRequired,
  unSetFavourite: PropTypes.func.isRequired,
  isFavourite: PropTypes.func.isRequired,
  populateFromStore: PropTypes.func.isRequired,
});
