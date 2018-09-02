import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, lifecycle, withProps } from 'recompose';
import styled from 'styled-components';
import moment from 'moment';

import { Panel } from '..';
import { waitForCollections } from '../../enhancers';
import { Collection } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Cell = styled.div`
  display: inline-block;
  margin: 5px 0;
`;

const Image = styled.img`
  width: 100px;
`;

const Album = ({ albums }) => {
  const { name, release_date: date, images } = albums.get();
  const year = moment(date).format('YYYY');
  return (
    <Panel>
      <Wrapper>
        <Column>
          <Image src={images[0].url} alt="Album cover" />
        </Column>
        <Column>
          <Cell>Title</Cell>
          <Cell>{name}</Cell>
        </Column>
        <Column>
          <Cell>Year</Cell>
          <Cell>{year}</Cell>
        </Column>
      </Wrapper>
    </Panel>
  );
};

Album.propTypes = {
  albums: Collection.isRequired,
};

const initialise = lifecycle({
  async componentDidMount() {
    const { albums } = this.props;
    await albums.fetch();
    this.forceUpdate();
  },
});

export default compose(
  inject('albums'),
  observer,
  initialise,
  waitForCollections('albums'),
  withProps(props => console.log('props', props) || {}),
)(Album);
