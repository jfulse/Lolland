import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose, withState } from 'recompose';
import styled from 'styled-components';

import { Game } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;

const SubmitField = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 10px;
  }
`;

const StyledButton = styled.button`
  &:hover {
    cursor: pointer;
  }
  &:disabled:hover {
    cursor: default;
  }
`;

const Submit = ({
  guess,
  setGuess,
  game: {
    reveal,
    submitGuess,
    next,
    currentGame: { state: { showAnswer } },
  },
}) => (
  <Wrapper>
    <StyledButton type="button" onClick={reveal} disabled={showAnswer}>
      Show answer
    </StyledButton>
    <SubmitField>
      <input value={guess} onChange={e => setGuess(e.target.value)} disabled={showAnswer} />
      <StyledButton type="button" onClick={() => submitGuess(guess)} disabled={showAnswer}>
        Check answer
      </StyledButton>
    </SubmitField>
    <StyledButton type="button" onClick={next}>
      Next
    </StyledButton>
  </Wrapper>
);

Submit.propTypes = {
  guess: PropTypes.string,
  setGuess: PropTypes.func.isRequired,
  game: Game.isRequired,
};

Submit.defaultProps = {
  guess: '',
};

export default compose(
  inject('game'),
  withState('guess', 'setGuess', ''),
  observer,
)(Submit);
