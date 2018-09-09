import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, Heart, If, ItemButton, Label, Panel, Player, ScrollList, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Playlist as PlaylistType, Favourites } from '../../propTypes';
import { intersperse } from '../../utils';

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
  hideTracks,
  emphasize,
}) => {
  const {
    name,
    release_date: date,
    images,
    uri,
    tracks,
  } = playlist;
  const year = moment(date).format('YYYY');
  const playlistIsFavourite = isFavourite(itemTypes.PLAYLIST, playlist);
  const onHeartClick = () => (playlistIsFavourite
    ? unSetFavourite(itemTypes.PLAYLIST, playlist)
    : setFavourite(itemTypes.PLAYLIST, playlist));
  const context = { type: itemTypes.PLAYLIST, item: playlist };
  const playlistTracks = tracks ? tracks.items.map(({ track }) => track) : [];
  const trackList = playlistTracks.map(({ id, name: trackName }) => (
    <ItemButton
      name={trackName}
      key={id}
      id={id}
      itemType={itemTypes.TRACK}
      context={context}
    />
  ));

  return (
    <Panel width="800px">
      <Heart outline={!playlistIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} hasContext />
      <Table>
        <Background imageUrl={images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Playlist cover" />
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{name}</strong>
          </Table.Cell>
        </Table.Column>
        <If condition={!hideTracks && Boolean(playlistTracks.length)}>
          <Table.Column emphasized={emphasize === itemTypes.ARTIST}>
            <Table.Cell>{`Track${playlistTracks.length > 1 ? 's' : ''}`}</Table.Cell>
            <Table.Cell>
              <ScrollList bold>
                {intersperse(trackList, ', ')}
              </ScrollList>
            </Table.Cell>
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Year</Table.Cell>
          <Table.Cell>
            <strong>{year}</strong>
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
  hideTracks: PropTypes.bool,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
};

Playlist.defaultProps = {
  hideCover: false,
  hideTracks: false,
  emphasize: false,
};

export default compose(
  inject('favourites'),
  waitForData('playlist.name'),
  observer,
)(Playlist);
