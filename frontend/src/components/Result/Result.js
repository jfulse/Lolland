import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { Switch } from '..';
import { Game } from '../../propTypes';
import { resultTypes } from '../../constants';

const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ResultBox = styled.div`
  border: 1px solid black;
  border-radius: 5px;
  padding: 20px 60px;
  margin-top: 30px;
  text-align: center;
`;

const Result = ({ game: { currentGame: { state: { answer, result } } } }) => (
  <ResultWrapper>
    <Switch equals={result}>
      <Switch.Case caseName={resultTypes.CORRECT}>
        <ResultBox>
          <i>{answer}</i>
          <br />
          <br />
          Correct!
          {'  '}
          <span role="img" aria-label="correct">🎉🍾</span>
        </ResultBox>
      </Switch.Case>
      <Switch.Case caseName={resultTypes.WRONG}>
        <ResultBox>
          <i>{answer}</i>
          <br />
          <br />
          Wrong..
          {'  '}
          <span role="img" aria-label="wrong">🤢🤮</span>
        </ResultBox>
      </Switch.Case>
    </Switch>
  </ResultWrapper>
);


Result.propTypes = {
  game: Game.isRequired,
};

export default compose(
  inject('game'),
  observer,
)(Result);
