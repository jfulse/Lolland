import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { ItemButton, Panel } from '../../components';
import { itemTypes, resultTypes } from '../../constants';
import { Game } from '../../propTypes';

const ResultWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 50px;
  flex-direction: column;
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
`;

const HistoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  h5 {
    text-align: center;
  }
`;

const Answer = styled.span`
  color: ${({ result }) => {
    if (result === resultTypes.CORRECT) return 'lightgreen';
    if (result === resultTypes.WRONG) return 'tomato';
    return 'initial';
  }};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
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
          <HistoryColumn>
            <h5>Clue</h5>
            {history.map(({
              result, fromItem, toItems,
            }) => (
              <Answer
                result={result}
                key={`clue-${fromItem.id}-${toItems[0].id}`}
              >
                <ItemButton
                  itemType={from}
                  id={fromItem.id}
                  name={fromItem.name}
                  playlist={to === itemTypes.PLAYLIST && toItems[0]}
                />
              </Answer>
            ))}
          </HistoryColumn>
          <HistoryColumn>
            <h5>Answers</h5>
            {history.map(({
              answer, result, fromItem: { id: fromId }, toItems: [{ id: toId }],
            }) => (
              <Answer
                result={result}
                italic={answer == null}
                key={`answer-${fromId}-${toId}`}
              >
                {answer || 'No answer'}
              </Answer>
            ))}
          </HistoryColumn>
          <HistoryColumn>
            <h5>Solutions</h5>
            {history.map(({
              solutions, fromItem: { id: fromId }, toItems: [{ id: toId }],
            }) => (
              <Answer
                key={`solution-${fromId}-${toId}`}
              >
                {solutions.join(', ')}
              </Answer>
            ))}
          </HistoryColumn>
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
