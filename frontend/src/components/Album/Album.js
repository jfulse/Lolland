import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { If, Panel } from '..';
import { waitForData } from '../../enhancers';
import { Album as AlbumType } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: relative;
  min-height: 150px;
`;

const Background = styled.div`
  background-image: ${({ image }) => `url(${image})`};
  filter: blur(3px) opacity(0.6);
  background-position: center;
  top: auto;
  bottom: auto;
  left: auto;
  right: auto;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-shadow: 0 0 10px black;
  color: #fdfdfd;
  z-index: 2;
  padding: 10px;
`;

const Cell = styled.div`
  display: inline-block;
  margin: 5px 0;
`;

const Image = styled.img`
  width: 100px;
  border: 1px solid black;
`;

const Album = ({
  album: {
    name, release_date: date, images, artists,
  },
  hideCover,
  hideArtists,
}) => {
  const year = moment(date).format('YYYY');
  return (
    <Panel>
      <Wrapper>
        <Background image={images[0].url} />
        <If condition={!hideCover}>
          <Column>
            <Image src={images[0].url} alt="Album cover" />
          </Column>
        </If>
        <If condition={!hideArtists}>
          <Column>
            <Cell>{`Artist${artists.length > 1 ? 's' : ''}`}</Cell>
            <Cell>
              <strong>
                {artists.map(({ name: artistName }) => artistName).join(', ')}
              </strong>
            </Cell>
          </Column>
        </If>
        <Column>
          <Cell>Title</Cell>
          <Cell>
            <strong>{name}</strong>
          </Cell>
        </Column>
        <Column>
          <Cell>Year</Cell>
          <Cell>
            <strong>{year}</strong>
          </Cell>
        </Column>
      </Wrapper>
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
