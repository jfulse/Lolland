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
import {
  Context, Favourites, Track as TrackType,
} from '../../propTypes';
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
  context: { type: contextType, item: contextItem },
  favourites: {
    isFavourite,
    setFavourite,
    unSetFavourite,
  },
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
  const trackIsFavourite = isFavourite(itemTypes.TRACK, track);
  const onHeartClick = () => (trackIsFavourite
    ? unSetFavourite(itemTypes.TRACK, track)
    : setFavourite(itemTypes.TRACK, track));
  const trackContext = { type: itemTypes.TRACK, item: track };
  const artistList = artists.map(({ id, name: artistName }) => (
    <ItemButton
      name={artistName}
      key={id}
      id={id}
      itemType={itemTypes.ARTIST}
      context={trackContext}
    />
  ));

  return (
    <Panel width="800px">
      <Heart outline={!trackIsFavourite} onClick={onHeartClick} />
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
        <If condition={!hideAlbum && [itemTypes.ALBUM, itemTypes.ARTIST].includes(contextType)}>
          <Table.Column emphasized={emphasize === itemTypes.ALBUM}>
            <Table.Cell>Album</Table.Cell>
            <Table.Cell>
              <strong>
                <ItemButton
                  name={albumName}
                  key={albumId}
                  id={albumId}
                  itemType={itemTypes.ALBUM}
                  context={trackContext}
                />
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hidePlaylist && contextType === itemTypes.PLAYLIST}>
          <Table.Column emphasized={emphasize === itemTypes.PLAYLIST}>
            <Table.Cell>Playlist</Table.Cell>
            <Table.Cell>
              <strong>
                <ItemButton
                  name={contextItem.name}
                  key={contextItem.id}
                  id={contextItem.id}
                  itemType={itemTypes.PLAYLIST}
                  context={trackContext}
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
  context: Context.isRequired,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
  favourites: Favourites.isRequired,
  hideAlbum: PropTypes.bool,
  hideArtists: PropTypes.bool,
  hideCover: PropTypes.bool,
  hidePlaylist: PropTypes.bool,
  autoplay: PropTypes.bool,
  showAlbumBackground: PropTypes.bool,
  track: TrackType.isRequired,
};

Track.defaultProps = {
  hideCover: false,
  hideArtists: false,
  hideAlbum: false,
  hidePlaylist: false,
  emphasize: false,
  autoplay: false,
  showAlbumBackground: true,
};

export default compose(
  inject('favourites'),
  waitForData('track.name'),
  observer,
)(Track);
