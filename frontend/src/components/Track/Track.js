import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, Heart, If, ItemButton, Label, Panel, Player, ScrollList, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Playlist, Track as TrackType } from '../../propTypes';
import { intersperse, strikeArtistsFromName } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Track = ({
  track,
  hideCover,
  hideArtists,
  hideAlbum,
  hidePlaylist,
  emphasize,
  autoplay,
  showAlbumBackground,
  playlist,
}) => {
  const {
    name,
    uri,
    album,
  } = track;
  const {
    id: albumId, name: albumName, release_date: date, images, artists,
  } = album;
  const year = moment(date).format('YYYY');
  const trackName = hideArtists ? strikeArtistsFromName(artists, name) : name;
  const artistList = artists.map(({ id, name: artistName }) => (
    <ItemButton
      name={artistName}
      key={id}
      id={id}
      itemType={itemTypes.ARTIST}
    />
  ));

  return (
    <Panel width="800px">
      <Heart itemType={itemTypes.TRACK} item={track} />
      <Player uri={uri} hasContext={false} autoplay={autoplay} />
      <Table>
        <Background imageUrl={showAlbumBackground && images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Album cover" />
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{trackName}</strong>
          </Table.Cell>
        </Table.Column>
        <If condition={!hideArtists}>
          <Table.Column emphasized={emphasize === itemTypes.ARTIST}>
            <Table.Cell>{`Artist${artists.length > 1 ? 's' : ''}`}</Table.Cell>
            <Table.Cell>
              <ScrollList bold>
                {intersperse(artistList, ', ')}
              </ScrollList>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hideAlbum && !playlist}>
          <Table.Column emphasized={emphasize === itemTypes.ALBUM}>
            <Table.Cell>Album</Table.Cell>
            <Table.Cell>
              <strong>
                <ItemButton
                  name={albumName}
                  key={albumId}
                  id={albumId}
                  itemType={itemTypes.ALBUM}
                />
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hidePlaylist && Boolean(playlist)}>
          <Table.Column emphasized={emphasize === itemTypes.PLAYLIST}>
            <Table.Cell>Playlist</Table.Cell>
            <Table.Cell>
              <strong>
                <ItemButton
                  name={playlist && playlist.name}
                  key={playlist && playlist.id}
                  id={playlist && playlist.id}
                  itemType={itemTypes.PLAYLIST}
                />
              </strong>
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
        TRACK
      </Label>
    </Panel>
  );
};

Track.propTypes = {
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
  hideAlbum: PropTypes.bool,
  hideArtists: PropTypes.bool,
  hideCover: PropTypes.bool,
  hidePlaylist: PropTypes.bool,
  autoplay: PropTypes.bool,
  showAlbumBackground: PropTypes.bool,
  track: TrackType.isRequired,
  playlist: PropTypes.oneOfType([
    PropTypes.bool,
    Playlist,
  ]),
};

Track.defaultProps = {
  playlist: false,
  hideCover: false,
  hideArtists: false,
  hideAlbum: false,
  hidePlaylist: false,
  emphasize: false,
  autoplay: false,
  showAlbumBackground: true,
};

export default waitForData('track.name')(Track);
