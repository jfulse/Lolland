import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import {
  Background, Heart, If, Label, Panel, Player, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Playlist as PlaylistType, Favourites } from '../../propTypes';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Playlist = ({
  playlist,
  favourites: {
    isFavourite,
    setFavourite,
    unSetFavourite,
  },
  hideCover,
  hideArtists,
  emphasize,
}) => {
  const {
    name, images, tracks, uri,
  } = playlist;
  const albumIsFavourite = isFavourite(itemTypes.PLAYLIST, playlist);
  const onHeartClick = () => (albumIsFavourite
    ? unSetFavourite(itemTypes.PLAYLIST, playlist)
    : setFavourite(itemTypes.PLAYLIST, playlist));

  return (
    <Panel width="800px">
      <Heart outline={!albumIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} hasContext />
      <Table>
        <Background image={images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Playlist cover" />
          </Table.Column>
        </If>
        <If condition={!hideArtists}>
          <Table.Column emphasized={emphasize === itemTypes.ARTIST}>
            <Table.Cell>Artists</Table.Cell>
            <Table.Cell>
              <strong>
                {tracks.map(({ name: artistName }) => artistName).join(', ')}
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{name}</strong>
          </Table.Cell>
        </Table.Column>
      </Table>
      <Label>
        PLAYLIST
      </Label>
    </Panel>
  );
};

Playlist.propTypes = {
  playlist: PlaylistType.isRequired,
  favourites: Favourites.isRequired,
  hideCover: PropTypes.bool,
  hideArtists: PropTypes.bool,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
};

Playlist.defaultProps = {
  hideCover: false,
  hideArtists: false,
  emphasize: false,
};

export default compose(
  inject('favourites'),
  waitForData('playlist.name'),
  observer,
)(Playlist);
