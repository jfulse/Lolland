import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, If, Label, Panel, Player, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { Track as TrackType } from '../../propTypes';
import { strikeArtistsFromName } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Track = ({
  track: {
    name,
    uri,
    album: {
      name: albumName, release_date: date, images, artists,
    },
  },
  hideCover,
  hideArtists,
  hideAlbum,
}) => {
  const year = moment(date).format('YYYY');
  const trackName = hideArtists ? strikeArtistsFromName(artists, name) : name;

  return (
    <Panel width="800px">
      <Player uri={uri} />
      <Table>
        <Background image={images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Album cover" />
          </Table.Column>
        </If>
        <If condition={!hideArtists}>
          <Table.Column>
            <Table.Cell>{`Artist${artists.length > 1 ? 's' : ''}`}</Table.Cell>
            <Table.Cell>
              <strong>
                {artists.map(({ name: artistName }) => artistName).join(', ')}
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hideAlbum}>
          <Table.Column>
            <Table.Cell>Album</Table.Cell>
            <Table.Cell>
              <strong>
                {albumName}
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{trackName}</strong>
          </Table.Cell>
        </Table.Column>
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
  track: TrackType.isRequired,
  hideCover: PropTypes.bool,
  hideArtists: PropTypes.bool,
  hideAlbum: PropTypes.bool,
};

Track.defaultProps = {
  hideCover: false,
  hideArtists: false,
  hideAlbum: false,
};

export default waitForData('track.name')(Track);
