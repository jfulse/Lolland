import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';

import { Choose, If } from '..';
import { itemTypes } from '../../constants';
import { Game, Route } from '../../propTypes';
import { printProps } from '../../utils';

const SetupGame = ({
  game: { setTypeFrom, setTypeTo, currentGame: { type: { from, to } } }, route: { push },
}) => (
  <Choose>
    <If condition={to == null}>
      <h2>What to guess:</h2>
      <If condition={from !== itemTypes.ARTIST}>
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.ARTIST)}
          role="button"
          label="Artist"
        />
      </If>
      <If condition={from !== itemTypes.ALBUM}>
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.ALBUM)}
          role="button"
          label="Album"
        />
      </If>
      <If condition={from !== itemTypes.PLAYLIST}>
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.PLAYLIST)}
          role="button"
          label="Playlist"
        />
      </If>
    </If>
    <If condition={from == null}>
      <h2>How to guess it:</h2>
      <If condition={to !== itemTypes.ARTIST}>
        <Choose.Alternative
          onClick={() => setTypeFrom(itemTypes.ARTIST)}
          role="button"
          label="Artist"
        />
      </If>
      <If condition={to !== itemTypes.ALBUM}>
        <Choose.Alternative
          onClick={() => setTypeFrom(itemTypes.ALBUM)}
          role="button"
          label="Album"
        />
      </If>
      <If condition={to !== itemTypes.PLAYLIST}>
        <Choose.Alternative
          onClick={() => setTypeFrom(itemTypes.PLAYLIST)}
          role="button"
          label="Playlist"
        />
      </If>
    </If>
  </Choose>
);

SetupGame.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  observer,
  printProps,
)(SetupGame);
