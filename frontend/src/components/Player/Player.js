import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose, lifecycle } from 'recompose';
import styled from 'styled-components';

import { If } from '..';
import { Player as PlayerType } from '../../propTypes';

const StyledDiv = styled.div`
  width: 150px;
  min-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid lightgray;
  background-image: radial-gradient(white, black);

  svg {
    fill: #252525;
  }

  &:hover {
    cursor: pointer;
    filter: brightness(90%);

    svg {
      fill: #565656;
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
    const { player: { setContextUri, setUri }, hasContext, uri } = this.props;
    if (hasContext) await setContextUri(uri);
    else await setUri(uri);
  },
  async componentWillReceiveProps({ uri: nextUri }) {
    const { uri, player: { setUri, setContextUri }, hasContext } = this.props;
    if (hasContext && uri !== nextUri) {
      await setContextUri(nextUri);
    } else if (!hasContext && uri !== nextUri) {
      await setUri(nextUri);
    }
  },
});

export default compose(
  inject('player'),
  withContextUri,
  observer,
)(Player);
