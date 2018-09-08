import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import {
  Background, Heart, If, Label, Panel, Player, ScrollList, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import { Artist as ArtistType, Favourites } from '../../propTypes';
import { intersperse, random } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Artist = ({
  artist,
  favourites: {
    isFavourite,
    setFavourite,
    unSetFavourite,
  },
  hideImage,
}) => {
  const {
    albums, name, images, uri,
  } = artist;
  const albumIsFavourite = isFavourite(itemTypes.ARTIST, artist);
  const onHeartClick = () => (albumIsFavourite
    ? unSetFavourite(itemTypes.ARTIST, artist)
    : setFavourite(itemTypes.ARTIST, artist));
  const image = images.length ? images[random(images.length)] : null;
  const albumNames = albums.map(({ name: albumName }) => albumName);

  return (
    <Panel width="800px">
      <Heart outline={!albumIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} hasContext />
      <Table>
        {image && <Background image={image.url} />}
        <If condition={!hideImage && Boolean(image)}>
          <Table.Column>
            <Image src={image.url} alt="Artist image" />
          </Table.Column>
        </If>
        <Table.Column>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>
            <strong>{name}</strong>
          </Table.Cell>
        </Table.Column>
        <Table.Column>
          <Table.Cell>Albums</Table.Cell>
          <Table.Cell>
            <ScrollList bold>
              {intersperse(albumNames, ', ')}
            </ScrollList>
          </Table.Cell>
        </Table.Column>
      </Table>
      <Label>
        ARTIST
      </Label>
    </Panel>
  );
};

Artist.propTypes = {
  artist: ArtistType.isRequired,
  favourites: Favourites.isRequired,
  hideImage: PropTypes.bool,
};

Artist.defaultProps = {
  hideImage: false,
};

export default compose(
  inject('favourites'),
  waitForData('artist.name'),
  observer,
)(Artist);
