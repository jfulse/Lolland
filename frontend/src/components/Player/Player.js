import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, lifecycle, withProps } from 'recompose';
import styled from 'styled-components';

import { If } from '..';
import { Player as PlayerType } from '../../propTypes';

const StyledDiv = styled.div`
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid lightgray;
  background-image: radial-gradient(#ff5714, #37bb53, #009aff);

  svg {
    fill: #353535;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(90%);

    svg {
      fill: #753838;
    }
  }
`;

const Player = ({ player: { start, stop, playing } }) => (
  <StyledDiv onClick={() => (playing ? stop() : start())}>
    <If condition={!playing}>
      <svg height="50" width="50">
        <polygon points="7,0 52,25 7,50" />
      </svg>
    </If>
    <If condition={playing}>
      <svg height="50" width="50">
        <polygon points="7,0 22,0 22,50 7,50" />
        <polygon points="32,0 47,0 47,50 32,50" />
      </svg>
    </If>
  </StyledDiv>
);

Player.propTypes = {
  player: PlayerType.isRequired,
};

const withContextUri = lifecycle({
  async componentDidMount() {
    const { player: { setContextUri }, uri } = this.props;
    await setContextUri(uri);
  },
});

export default compose(
  inject('player'),
  withContextUri,
  observer,
  withProps(props => console.log('🍾 props', props) || {}),
)(Player);
