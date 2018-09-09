import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { Collection, Popups } from '../../propTypes';
import { itemTypes } from '../../constants';
import { capitalize } from '../../utils';

const StyledButton = styled.div`
  display: inline;
  &:hover {
    cursor: pointer;
  }
`;

const ItemButton = ({
  itemType,
  id,
  name,
  context,
  albums: { get: getAlbum },
  artists: { get: getArtist },
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
    default:
      break;
  }

  return (
    <StyledButton
      type="button"
      onClick={async () => {
        const item = await get(id);
        openPopup(title, title, { [key]: item, context });
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
  context: PropTypes.oneOf(Object.keys(itemTypes)).isRequired,
  popups: Popups.isRequired,
  albums: Collection.isRequired,
  artists: Collection.isRequired,
  tracks: Collection.isRequired,
};

export default compose(
  inject('albums'),
  inject('artists'),
  inject('tracks'),
  inject('popups'),
  observer,
)(ItemButton);
