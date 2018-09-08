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
import { Album as AlbumType, Favourites } from '../../propTypes';
import { intersperse, strikeArtistsFromName } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Album = ({
  album,
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
    name, release_date: date, images, artists, uri,
  } = album;
  const year = moment(date).format('YYYY');
  const albumName = hideArtists ? strikeArtistsFromName(artists, name) : name;
  const albumIsFavourite = isFavourite(itemTypes.ALBUM, album);
  const onHeartClick = () => (albumIsFavourite
    ? unSetFavourite(itemTypes.ALBUM, album)
    : setFavourite(itemTypes.ALBUM, album));
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
      <Heart outline={!albumIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} hasContext />
      <Table>
        <Background imageUrl={images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Album cover" />
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Title</Table.Cell>
          <Table.Cell>
            <strong>{albumName}</strong>
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
        <Table.Column>
          <Table.Cell>Year</Table.Cell>
          <Table.Cell>
            <strong>{year}</strong>
          </Table.Cell>
        </Table.Column>
      </Table>
      <Label>
        ALBUM
      </Label>
    </Panel>
  );
};

Album.propTypes = {
  album: AlbumType.isRequired,
  favourites: Favourites.isRequired,
  hideCover: PropTypes.bool,
  hideArtists: PropTypes.bool,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
};

Album.defaultProps = {
  hideCover: false,
  hideArtists: false,
  emphasize: false,
};

export default compose(
  inject('favourites'),
  waitForData('album.name'),
  observer,
)(Album);
