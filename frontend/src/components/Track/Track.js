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
import { Favourites, Track as TrackType } from '../../propTypes';
import { strikeArtistsFromName } from '../../utils';

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Track = ({
  track,
  favourites: {
    isFavourite,
    setFavourite,
    unSetFavourite,
  },
  hideCover,
  hideArtists,
  hideAlbum,
  emphasize,
}) => {
  const {
    name,
    uri,
    album: {
      name: albumName, release_date: date, images, artists,
    },
  } = track;
  const year = moment(date).format('YYYY');
  const trackName = hideArtists ? strikeArtistsFromName(artists, name) : name;
  const trackIsFavourite = isFavourite(itemTypes.TRACK, track);
  const onHeartClick = () => (trackIsFavourite
    ? unSetFavourite(itemTypes.TRACK, track)
    : setFavourite(itemTypes.TRACK, track));

  return (
    <Panel width="800px">
      <Heart outline={!trackIsFavourite} onClick={onHeartClick} />
      <Player uri={uri} />
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
        <If condition={!hideAlbum}>
          <Table.Column emphasized={emphasize === itemTypes.ALBUM}>
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
  emphasize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(Object.keys(itemTypes)),
  ]),
  favourites: Favourites.isRequired,
};

Track.defaultProps = {
  hideCover: false,
  hideArtists: false,
  hideAlbum: false,
  emphasize: false,
};

export default compose(
  inject('favourites'),
  waitForData('track.name'),
  observer,
)(Track);
