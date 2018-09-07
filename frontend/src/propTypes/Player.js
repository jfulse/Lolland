import PropTypes from 'prop-types';

const PlayingState = PropTypes.shape({
  uri: PropTypes.string,
  hasContext: PropTypes.bool,
  trackNumber: PropTypes.number,
});

export default PropTypes.shape({
  ready: PropTypes.bool.isRequired,
  playing: PlayingState.isRequired,
  paused: PlayingState.isRequired,
  stop: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
});
