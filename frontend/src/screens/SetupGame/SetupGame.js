import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { Choose, If } from '../../components';
import { itemTypes } from '../../constants';
import { Game, Route } from '../../propTypes';

class SetupGame extends React.Component {
  componentDidUpdate() {
    const {
      game: {
        currentGame: { type: { from, to } },
      },
      route: { push },
    } = this.props;

    if (from != null && to != null) {
      push('/quiz');
    }
  }

  render() {
    const {
      game: {
        setTypeFrom,
        setTypeTo,
        currentGame: { type: { from, to } },
      },
    } = this.props;
    return (
      <Choose>
        <If condition={to == null}>
          <h2>What to guess:</h2>
          <If condition={[itemTypes.ARTIST, itemTypes.PLAYLIST].indexOf(from) < 0}>
            <Choose.Alternative
              onClick={() => setTypeTo(itemTypes.ARTIST)}
              role="button"
              label="Artist"
            />
          </If>
          <If condition={!from || from === itemTypes.TRACK}>
            <Choose.Alternative
              onClick={() => setTypeTo(itemTypes.ALBUM)}
              role="button"
              label="Album"
            />
          </If>
          <If condition={!from || from === itemTypes.TRACK}>
            <Choose.Alternative
              onClick={() => setTypeTo(itemTypes.PLAYLIST)}
              role="button"
              label="Playlist"
            />
          </If>
        </If>
        <If condition={from == null}>
          <h2>How to guess it:</h2>
          <If condition={!to || to === itemTypes.ARTIST}>
            <Choose.Alternative
              onClick={() => setTypeFrom(itemTypes.ALBUM)}
              role="button"
              label="From album"
            />
          </If>
          <Choose.Alternative
            onClick={() => setTypeFrom(itemTypes.TRACK)}
            role="button"
            label="From track"
          />
        </If>
      </Choose>
    );
  }
}

SetupGame.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  observer,
)(SetupGame);
