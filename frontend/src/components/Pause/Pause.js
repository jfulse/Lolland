import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { If } from '..';
import { Player as PlayerType } from '../../propTypes';

const StyledSpan = styled.span`
  width: 12px;
  min-width: 12px;
  display: inherit;

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

const Pause = ({
  player: {
    play,
    stop,
    playing: { uri },
    paused: { uri: pausedUri, hasContext },
  },
}) => {
  const isPlaying = Boolean(uri);
  const isPaused = Boolean(pausedUri);
  let onClick = () => null;

  if (isPlaying) {
    onClick = stop;
  } else if (isPaused) {
    onClick = () => play(hasContext, pausedUri);
  }

  return (
    <StyledSpan onClick={onClick}>
      <If condition={isPaused}>
        <svg height="20" width="14">
          <polygon points="0,0 14,10 0,20" />
        </svg>
      </If>
      <If condition={isPlaying}>
        <svg height="20" width="12">
          <polygon points="0,0 5,0 5,20 0,20" />
          <polygon points="7,0 12,0 12,20 7,20" />
        </svg>
      </If>
    </StyledSpan>
  );
};

Pause.propTypes = {
  player: PlayerType.isRequired,
};

export default compose(
  inject('player'),
  observer,
)(Pause);
