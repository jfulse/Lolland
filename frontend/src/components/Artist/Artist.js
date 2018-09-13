import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, Heart, If, ItemButton, Label, Panel, Player, ScrollList, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { albumTypes, itemTypes } from '../../constants';
import { Artist as ArtistType } from '../../propTypes';
import { intersperse } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const AlbumButton = ({ id, name, artist }) => (
  <ItemButton
    name={name}
    key={id}
    id={id}
    itemType={itemTypes.ALBUM}
  />
);

AlbumButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artist: ArtistType.isRequired,
};

const sortByDate = albums => albums.sort((
  { release_date: date1 },
  { release_date: date2 },
) => moment(date2) - moment(date1));

const Artist = ({
  artist,
  hideImage,
  autoplay,
}) => {
  const {
    albums: allAlbums, name, images, uri,
  } = artist;
  const imageUrl = images.length && images[0].url ? images[0].url : null;
  const albums = allAlbums.filter(({ album_type: type }) => type === albumTypes.album);
  const compilations = allAlbums.filter(({ album_type: type }) => type === albumTypes.compilation);
  const singles = allAlbums.filter(({ album_type: type }) => type === albumTypes.single);

  const albumList = sortByDate(albums).map(({ id, name: albumName }) => (
    <AlbumButton key={id} id={id} name={albumName} artist={artist} />
  ));
  const compilationList = sortByDate(compilations).map(({ id, name: albumName }) => (
    <AlbumButton key={id} id={id} name={albumName} artist={artist} />
  ));
  const singleList = sortByDate(singles).map(({ id, name: albumName }) => (
    <AlbumButton key={id} id={id} name={albumName} artist={artist} />
  ));

  return (
    <Panel width="800px">
      <Heart itemType={itemTypes.ARTIST} item={artist} />
      <Player uri={uri} hasContext autoplay={autoplay} />
      <Table>
        <Background imageUrl={imageUrl} />
        <If condition={!hideImage && Boolean(imageUrl)}>
          <Table.Column>
            <Image src={imageUrl} alt="Artist image" />
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>
            <strong>{name}</strong>
          </Table.Cell>
        </Table.Column>
        <If condition={albums.length > 0}>
          <Table.Column>
            <Table.Cell>Albums</Table.Cell>
            <Table.Cell>
              <ScrollList bold>
                {intersperse(albumList, ', ')}
              </ScrollList>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={singles.length > 0}>
          <Table.Column>
            <Table.Cell>Singles</Table.Cell>
            <Table.Cell>
              <ScrollList bold>
                {intersperse(singleList, ', ')}
              </ScrollList>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={compilations.length > 0}>
          <Table.Column>
            <Table.Cell>Compilations</Table.Cell>
            <Table.Cell>
              <ScrollList bold>
                {intersperse(compilationList, ', ')}
              </ScrollList>
            </Table.Cell>
          </Table.Column>
        </If>
      </Table>
      <Label>
        ARTIST
      </Label>
    </Panel>
  );
};

Artist.propTypes = {
  artist: ArtistType.isRequired,
  hideImage: PropTypes.bool,
  autoplay: PropTypes.bool,
};

Artist.defaultProps = {
  hideImage: false,
  autoplay: false,
};

export default waitForData('artist.name')(Artist);
