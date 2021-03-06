import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { Collection, Playlist, Popups } from '../../propTypes';
import { itemTypes } from '../../constants';
import { capitalize } from '../../utils';

const StyledButton = styled.div`
  display: inline;
  &:hover {
    cursor: pointer;
    filter: brightness(85%);
    // filter: ${({ dark }) => (dark ? 'opacity(50%)' : 'brightness(85%)')}};
  }
  // border: ${({ dark }) => (dark ? '1px solid lightgray' : 'none')};
  // border-radius: 5px;
  // padding: ${({ dark }) => (dark ? '3px 5px' : '0')};
  // width: ${({ dark }) => (dark ? 'fit-content' : 'initial')};
`;

const ItemButton = ({
  itemType,
  id,
  name,
  playlist,
  dark,
  albums: { get: getAlbum },
  artists: { get: getArtist },
  playlists: { get: getPlaylist },
  tracks: { get: getTrack },
  popups: { openPopup },
}) => {
  const title = capitalize(itemType);
  const key = itemType.toLowerCase();
  let get = () => null;

  switch (itemType) {
    case itemTypes.ALBUM:
      get = getAlbum;
      break;
    case itemTypes.ARTIST:
      get = getArtist;
      break;
    case itemTypes.TRACK:
      get = getTrack;
      break;
    case itemTypes.PLAYLIST:
      get = getPlaylist;
      break;
    default:
      break;
  }

  return (
    <StyledButton
      type="button"
      dark={dark}
      onClick={async () => {
        const item = await get(id);
        const popupProps = { [key]: item };
        if (playlist) Object.assign(popupProps, { playlist });

        openPopup(title, title, popupProps);
      }}
    >
      {name}
    </StyledButton>
  );
};

ItemButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  itemType: PropTypes.oneOf(Object.keys(itemTypes)).isRequired,
  playlist: PropTypes.oneOfType([
    PropTypes.bool,
    Playlist,
  ]),
  dark: PropTypes.bool,
  popups: Popups.isRequired,
  albums: Collection.isRequired,
  artists: Collection.isRequired,
  playlists: Collection.isRequired,
  tracks: Collection.isRequired,
};

ItemButton.defaultProps = {
  playlist: false,
  dark: false,
};

export default compose(
  inject('albums'),
  inject('artists'),
  inject('tracks'),
  inject('playlists'),
  inject('popups'),
  observer,
)(ItemButton);
