import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, If, Panel, Player, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { Album as AlbumType } from '../../propTypes';
import { strikeArtistsFromName } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Album = ({
  album: {
    name, release_date: date, images, artists, uri,
  },
  hideCover,
  hideArtists,
}) => {
  const year = moment(date).format('YYYY');
  const albumName = hideArtists ? strikeArtistsFromName(artists, name) : name;

  return (
    <Panel width="800px">
      <Player uri={uri} hasContext />
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
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{albumName}</strong>
          </Table.Cell>
        </Table.Column>
        <Table.Column>
          <Table.Cell>Year</Table.Cell>
          <Table.Cell>
            <strong>{year}</strong>
          </Table.Cell>
        </Table.Column>
      </Table>
    </Panel>
  );
};

Album.propTypes = {
  album: AlbumType.isRequired,
  hideCover: PropTypes.bool,
  hideArtists: PropTypes.bool,
};

Album.defaultProps = {
  hideCover: false,
  hideArtists: false,
};

export default waitForData('album')(Album);
