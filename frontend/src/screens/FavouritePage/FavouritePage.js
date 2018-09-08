import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { Album, If, Track } from '../../components';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Favourites } from '../../propTypes';

const ItemHeader = styled.h2`
  text-align: center;
  margin: 35px;
`;

const FavouritePage = ({ favourites: { artists, albums, tracks } }) => (
  <div>
    <If condition={artists.length > 0}>
      <ItemHeader>
        Artists
      </ItemHeader>
      {artists.map(({ name }) => name).join(', ')}
    </If>
    <If condition={albums.length > 0}>
      <ItemHeader>
        Albums
      </ItemHeader>
      {albums.map(album => (
        <Album album={album} key={album.uri} />
      ))}
    </If>
    <If condition={tracks.length > 0}>
      <ItemHeader>
        Tracks
      </ItemHeader>
      {tracks.map(track => (
        <Track track={track} key={track.uri} context={itemTypes.ALBUM} />
      ))}
    </If>
  </div>
);

FavouritePage.propTypes = {
  favourites: Favourites.isRequired,
};

export default compose(
  inject('favourites'),
  waitForData('favourites'),
  observer,
)(FavouritePage);
