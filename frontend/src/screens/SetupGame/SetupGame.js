/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint jsx-a11y/label-has-for: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';

import { Choose } from '../../components';
import { itemTypes } from '../../constants';
import { Game, Route } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: baseline;
  width: 700px;
`;

const StartButton = styled.button`
  width: 80px;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
  margin: 30px;
  &:hover {
    cursor: pointer;
    color: darkgray;
  }
  &:disabled{
    color: lightgray;
    &:hover {
      cursor: default;
      color: lightgray;
    }
  }
`;

const Settings = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  margin-right: 7px;
  &:hover {
    cursor: pointer;
  }
`;

const SetupGame = ({
  game: {
    setTypeFrom,
    setTypeTo,
    currentGame: {
      settings,
      type: { from, to },
    },
  },
  route: { push },
  setAutoplay,
  setShowAlbumBackground,
}) => (
  <Wrapper>
    <SettingsWrapper>
      <Choose selectedId={to || ''}>
        <h2>What to guess:</h2>
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.ARTIST)}
          role="button"
          label="Artist"
          disabled={[itemTypes.ARTIST, itemTypes.PLAYLIST].indexOf(from) > -1}
          id={itemTypes.ARTIST}
        />
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.ALBUM)}
          role="button"
          label="Album"
          disabled={from && from !== itemTypes.TRACK}
          id={itemTypes.ALBUM}
        />
        <Choose.Alternative
          onClick={() => setTypeTo(itemTypes.PLAYLIST)}
          role="button"
          label="Playlist"
          disabled={from && from !== itemTypes.TRACK}
          id={itemTypes.PLAYLIST}
        />
      </Choose>
      <Choose selectedId={from || ''}>
        <h2>How to guess it:</h2>
        <Choose.Alternative
          onClick={() => setTypeFrom(itemTypes.ALBUM)}
          role="button"
          label="From album"
          disabled={to && to !== itemTypes.ARTIST}
          id={itemTypes.ALBUM}
        />
        <Choose.Alternative
          onClick={() => setTypeFrom(itemTypes.TRACK)}
          role="button"
          label="From track"
          id={itemTypes.TRACK}
        />
      </Choose>
      <Settings>
        <label htmlFor="checkbox-autoplay-music">
          <StyledInput
            type="checkbox"
            id="checkbox-autoplay-music"
            checked={settings.autoplay}
            onChange={e => setAutoplay(e.target.checked)}
          />
          autoplay music
        </label>
        <label htmlFor="checkbox-show-album-background">
          <StyledInput
            type="checkbox"
            id="checkbox-show-album-background"
            checked={settings.showAlbumBackground}
            onChange={e => setShowAlbumBackground(e.target.checked)}
          />
          show album background
        </label>
      </Settings>
    </SettingsWrapper>
    <StartButton
      disabled={from == null || to == null}
      onClick={() => push('/quiz')}
    >
      Start
    </StartButton>
  </Wrapper>
);

SetupGame.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
  setAutoplay: PropTypes.func.isRequired,
  setShowAlbumBackground: PropTypes.func.isRequired,
};

const withSettingsHandlers = withHandlers({
  setAutoplay: ({
    game: {
      setSettings,
      currentGame: { settings },
    },
  }) => checked => setSettings({
    ...settings,
    autoplay: checked,
  }),
  setShowAlbumBackground: ({
    game: {
      setSettings,
      currentGame: { settings },
    },
  }) => checked => setSettings({
    ...settings,
    showAlbumBackground: checked,
  }),
});

export default compose(
  inject('game'),
  inject('route'),
  withSettingsHandlers,
  observer,
)(SetupGame);
