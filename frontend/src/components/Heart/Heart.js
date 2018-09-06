import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeartWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 3px;
  z-index: 1;
  color: transparent;
  text-shadow: 0 0 3px red;

  &:hover {
    cursor: pointer;
    text-shadow: 0 0 3px #e20101;
  }
`;

const OutlineHeartWrapper = styled(HeartWrapper)`
  text-shadow: 0 0 7px red;

  [title]:before {
    content: attr(title);
    position: absolute;
    width: 100%;
    text-shadow: 0 0 0 #eac2c2;
  }

  &:hover {
    text-shadow: 0 0 7px #e20101;

    [title]:before {
      text-shadow: 0 0 0 #dababa;
    }
  }
`;

const Heart = ({ outline, onClick }) => (
  <div>
    {!outline && (
      <HeartWrapper outline onClick={onClick}>
        <span role="img" aria-label="heart">❤️</span>
      </HeartWrapper>
    )}
    {outline && (
      <OutlineHeartWrapper outline onClick={onClick}>
        <span role="img" aria-label="heart" title="❤️">❤️</span>
      </OutlineHeartWrapper>
    )}
  </div>
);

Heart.propTypes = {
  outline: PropTypes.bool,
  onClick: PropTypes.func,
};

Heart.defaultProps = {
  outline: false,
  onClick: () => null,
};

export default Heart;
