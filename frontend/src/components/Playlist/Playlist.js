import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, Heart, If, ItemButton, Label, Panel, Player, ScrollList, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Playlist as PlaylistType } from '../../propTypes';
import { intersperse } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Playlist = ({
  playlist,
  hideCover,
  hideTracks,
  emphasize,
  autoplay,
}) => {
  const {
    name,
    release_date: date,
    images,
    uri,
    tracks,
  } = playlist;
  const year = moment(date).format('YYYY');
  const playlistTracks = tracks ? tracks.map(({ track }) => track) : [];
  const trackList = playlistTracks.map(({ id, name: trackName }) => (
    <ItemButton
      name={trackName}
      key={id}
      id={id}
      itemType={itemTypes.TRACK}
      playlist={playlist}
    />
  ));

  return (
    <Panel width="800px">
      <Heart itemType={itemTypes.PLAYLIST} item={playlist} />
      <Player uri={uri} hasContext autoplay={autoplay} />
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
  hideCover: PropTypes.bool,
  hideTracks: PropTypes.bool,
  autoplay: PropTypes.bool,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
};

Playlist.defaultProps = {
  hideCover: false,
  hideTracks: false,
  emphasize: false,
  autoplay: false,
};

export default waitForData('playlist.name')(Playlist);
