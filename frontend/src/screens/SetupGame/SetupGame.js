/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint jsx-a11y/label-has-for: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose, withHandlers, withState } from 'recompose';
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
  selectedFrom,
  setSelectedFrom,
  selectedTo,
  setSelectedTo,
  route: { push },
  setAutoplay,
}) => (
  <Wrapper>
    <SettingsWrapper>
      <Choose selectedId={selectedTo}>
        <h2>What to guess:</h2>
        <Choose.Alternative
          onClick={() => {
            setTypeTo(itemTypes.ARTIST);
            setSelectedTo('to-artist');
          }}
          role="button"
          label="Artist"
          disabled={[itemTypes.ARTIST, itemTypes.PLAYLIST].indexOf(from) > -1}
          id="to-artist"
        />
        <Choose.Alternative
          onClick={() => {
            setTypeTo(itemTypes.ALBUM);
            setSelectedTo('to-album');
          }}
          role="button"
          label="Album"
          disabled={from && from !== itemTypes.TRACK}
          id="to-album"
        />
        <Choose.Alternative
          onClick={() => {
            setTypeTo(itemTypes.PLAYLIST);
            setSelectedTo('to-playlist');
          }}
          role="button"
          label="Playlist"
          disabled={from && from !== itemTypes.TRACK}
          id="to-playlist"
        />
      </Choose>
      <Choose selectedId={selectedFrom}>
        <h2>How to guess it:</h2>
        <Choose.Alternative
          onClick={() => {
            setTypeFrom(itemTypes.ALBUM);
            setSelectedFrom('from-album');
          }}
          role="button"
          label="From album"
          disabled={to && to !== itemTypes.ARTIST}
          id="from-album"
        />
        <Choose.Alternative
          onClick={() => {
            setTypeFrom(itemTypes.TRACK);
            setSelectedFrom('from-track');
          }}
          role="button"
          label="From track"
          id="from-track"
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
      </Settings>
    </SettingsWrapper>
    <StartButton
      disabled={from == null || to == null}
      onClick={() => push(`/quiz?${JSON.stringify(settings)}`)}
    >
      Start
    </StartButton>
  </Wrapper>
);

SetupGame.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
  selectedFrom: PropTypes.string.isRequired,
  setSelectedFrom: PropTypes.func.isRequired,
  selectedTo: PropTypes.string.isRequired,
  setSelectedTo: PropTypes.func.isRequired,
  setAutoplay: PropTypes.func.isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  withState('selectedFrom', 'setSelectedFrom', ''),
  withState('selectedTo', 'setSelectedTo', ''),
  withHandlers({
    setAutoplay: ({ game: { setSettings, currentGame: { settings } } }) => checked => setSettings({
      ...settings,
      autoplay: checked,
    }),
  }),
  observer,
)(SetupGame);
