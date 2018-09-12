import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import {
  Artist, Album, Favourites, Playlist, Track,
} from '../../propTypes';
import { itemTypes } from '../../constants';

const HeartWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 3px;
  z-index: 10;
  color: transparent;
  text-shadow: 0 0 3px red;

  &:hover {
    cursor: pointer;
    text-shadow: 0 0 3px #e20101;
  }
`;

const OutlineHeartWrapper = styled(HeartWrapper)`
  text-shadow: 0 0 7px red;

  [title]:before {
    content: attr(title);
    position: absolute;
    width: 100%;
    text-shadow: 0 0 0 #eac2c2;
  }

  &:hover {
    text-shadow: 0 0 7px #e20101;

    [title]:before {
      text-shadow: 0 0 0 #dababa;
    }
  }
`;

const Heart = ({ itemType, item, favourites: { isFavourite, unSetFavourite, setFavourite } }) => {
  const favourite = isFavourite(itemType, item);
  const onClick = () => (favourite
    ? unSetFavourite(itemType, item)
    : setFavourite(itemType, item));

  return (
    <div>
      {favourite && (
        <HeartWrapper outline onClick={onClick}>
          <span role="img" aria-label="heart">❤️</span>
        </HeartWrapper>
      )}
      {!favourite && (
        <OutlineHeartWrapper outline onClick={onClick}>
          <span role="img" aria-label="heart" title="❤️">❤️</span>
        </OutlineHeartWrapper>
      )}
    </div>
  );
};

Heart.propTypes = {
  itemType: PropTypes.oneOf(Object.keys(itemTypes)).isRequired,
  item: PropTypes.oneOfType([Artist, Album, Playlist, Track]).isRequired,
  favourites: Favourites.isRequired,
};

export default compose(
  inject('favourites'),
  observer,
)(Heart);
