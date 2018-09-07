import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { If } from '..';
import { Player as PlayerType } from '../../propTypes';

const StyledDiv = styled.div`
  position: relative;
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
    svg {
      fill: #565656;
    }
  }
`;

const SkipWrapper = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 8px;

  svg {
    fill: #969595!important;
    &:hover {
      fill: #848282!important;
    }
  }
  svg:first-of-type {
    visibility: ${({ trackNumber }) => (trackNumber > 1 ? 'visible' : 'hidden')}
  }
`;

const Player = ({
  uri,
  hasContext,
  player: {
    ready,
    stop,
    play,
    next,
    previous,
    playing: { uri: playingUri, trackNumber },
  },
}) => {
  const isPlaying = playingUri === uri;

  return (
    <StyledDiv onClick={() => (isPlaying ? stop() : play(hasContext, uri))}>
      <If condition={ready && !isPlaying}>
        <svg height="50" width="50">
          <polygon points="7,0 52,25 7,50" />
        </svg>
      </If>
      <If condition={ready && isPlaying}>
        <svg height="50" width="50">
          <polygon points="7,0 22,0 22,50 7,50" />
          <polygon points="32,0 47,0 47,50 32,50" />
        </svg>
      </If>
      <If condition={isPlaying && hasContext}>
        <SkipWrapper trackNumber={trackNumber}>
          <svg
            height="20"
            width="30"
            onClick={(e) => {
              e.stopPropagation();
              previous();
            }}
          >
            <polygon points="30,0 13,10 30,20" />
            <polygon points="10,0 13,0 13,20 10 20" />
          </svg>
          <svg
            height="20"
            width="30"
            onClick={async (e) => {
              e.stopPropagation();
              next();
            }}
          >
            <polygon points="0,0 17,10 0,20" />
            <polygon points="20,0 17,0 17,20 20,20" />
          </svg>
        </SkipWrapper>
      </If>
    </StyledDiv>
  );
};

Player.propTypes = {
  player: PlayerType.isRequired,
  uri: PropTypes.string.isRequired,
  hasContext: PropTypes.bool.isRequired,
};

export default compose(
  inject('player'),
  observer,
)(Player);
