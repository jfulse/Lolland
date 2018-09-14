import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { ItemButton, Panel } from '../../components';
import { itemTypes, resultTypes } from '../../constants';
import { Game } from '../../propTypes';
import { capitalize, intersperse } from '../../utils';
import { defaultBackground } from '../../styles';

const ResultWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 50px;
  flex-direction: column;
  color: #fdfdfd;
  text-shadow: 0 0 10px black;
`;

const Header = styled.h2`
  text-align: center;
  margin: 35px;
`;

const ScoreBoard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  padding: 30px;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${defaultBackground};
`;

const ScoreHeader = styled.h3`
  text-align: center;
  margin: 35px;
`;

const HistoryBoard = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  justify-content: space-around;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-auto-rows: auto;
  align-items: center;
  grid-row-gap: 6px;
  grid-column-gap: 10px;
  font-size: 16px;
`;

const HistoryHeader = styled.h5`
  margin: 10px 0;
  font-size: 17px;
`;

const Answer = styled.span`
  color: ${({ result }) => {
    if (result === resultTypes.CORRECT) return 'lightgreen';
    if (result === resultTypes.WRONG) return 'tomato';
    return 'initial';
  }};
  visibility: ${({ result }) => (result === resultTypes.PENDING ? 'hidden' : 'visible')};
  margin: 5px;
`;

const ResultPage = ({
  game: {
    currentGame: {
      correctAnswers,
      wrongAnswers,
      history,
      type: {
        from,
        to,
      },
    },
  },
}) => (
  <ResultWrapper>
    <Header>
      Results:
    </Header>
    <Panel minWidth="750px">
      <ScoreBoard>
        <ScoreHeader>
          Correct answers:
          &nbsp;&nbsp;
          {correctAnswers}
          {' / '}
          {correctAnswers + wrongAnswers}
        </ScoreHeader>
        <h4>Rounds:</h4>
        <HistoryBoard>
          <HistoryHeader>{capitalize(from)}</HistoryHeader>
          <HistoryHeader>Answer</HistoryHeader>
          <HistoryHeader>{capitalize(to)}</HistoryHeader>
          {history.map(({
            answer, result, fromItem, toItems,
          }) => (
            <React.Fragment key={`result-${fromItem.id}-${toItems[0].id}`}>
              <ItemButton
                itemType={from}
                id={fromItem.id}
                name={fromItem.name}
                playlist={to === itemTypes.PLAYLIST && toItems[0]}
                dark
              />
              <Answer result={result}>
                {answer || 'No answer'}
              </Answer>
              <div>
                {intersperse(toItems.map(({ id, name }) => (
                  <ItemButton
                    itemType={to}
                    id={id}
                    key={`result-solution-${id}`}
                    name={name}
                    dark
                  />
                )), ', ')}
              </div>
            </React.Fragment>
          ))}
        </HistoryBoard>
      </ScoreBoard>
    </Panel>
  </ResultWrapper>
);

ResultPage.propTypes = {
  game: Game.isRequired,
};

export default compose(
  inject('game'),
  observer,
)(ResultPage);
