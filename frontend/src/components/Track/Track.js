import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';
import moment from 'moment';

import {
  Background, Heart, If, Label, Panel, Player, Table,
} from '..';
import { waitForData } from '../../enhancers';
import { itemTypes } from '../../constants';
import {
  Favourites, Game, Popups, Track as TrackType,
} from '../../propTypes';
import { strikeArtistsFromName } from '../../utils';

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
  context,
  popups: { openPopup },
  game: {
    currentGame: { state: { solutions: [playlistName] } },
  },
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
    name: albumName, release_date: date, images, artists,
  } = album;
  const year = moment(date).format('YYYY');
  const trackName = hideArtists ? strikeArtistsFromName(artists, name) : name;
  const trackIsFavourite = isFavourite(itemTypes.TRACK, track);
  const onHeartClick = () => (trackIsFavourite
    ? unSetFavourite(itemTypes.TRACK, track)
    : setFavourite(itemTypes.TRACK, track));

  return (
    <Panel width="800px">
      <Heart outline={!trackIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} hasContext={false} />
      <Table>
        <Background image={images[0].url} />
        <If condition={!hideCover}>
          <Table.Column>
            <Image src={images[0].url} alt="Album cover" />
          </Table.Column>
        </If>
        <If condition={!hideArtists}>
          <Table.Column emphasized={emphasize === itemTypes.ARTIST}>
            <Table.Cell>{`Artist${artists.length > 1 ? 's' : ''}`}</Table.Cell>
            <Table.Cell>
              <strong>
                {artists.map(({ name: artistName }) => artistName).join(', ')}
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hideAlbum && [itemTypes.ALBUM, itemTypes.ARTIST].includes(context)}>
          <Table.Column
            emphasized={emphasize === itemTypes.ALBUM}
            onClick={() => openPopup('Album', 'Album', { album })}
            clickable
          >
            <Table.Cell>Album</Table.Cell>
            <Table.Cell>
              <strong>
                {albumName}
              </strong>
            </Table.Cell>
          </Table.Column>
        </If>
        <If condition={!hidePlaylist && context === itemTypes.PLAYLIST}>
          <Table.Column emphasized={emphasize === itemTypes.PLAYLIST}>
            <Table.Cell>Playlist</Table.Cell>
            <Table.Cell>
              <strong>
                {playlistName}
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
  context: PropTypes.oneOf(Object.keys(itemTypes)).isRequired,
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
  favourites: Favourites.isRequired,
  game: Game.isRequired,
  hideAlbum: PropTypes.bool,
  hideArtists: PropTypes.bool,
  hideCover: PropTypes.bool,
  hidePlaylist: PropTypes.bool,
  popups: Popups.isRequired,
  track: TrackType.isRequired,
};

Track.defaultProps = {
  hideCover: false,
  hideArtists: false,
  hideAlbum: false,
  hidePlaylist: false,
  emphasize: false,
};

export default compose(
  inject('favourites'),
  inject('game'),
  inject('popups'),
  waitForData('track.name'),
  observer,
)(Track);
