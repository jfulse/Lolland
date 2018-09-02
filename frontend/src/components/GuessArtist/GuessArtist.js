import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import { Album, Choose, Switch } from '..';
import { itemTypes } from '../../constants';
import { Game } from '../../propTypes';

const Question = styled.h3`
  text-align: center;
`;

const GuessArtist = ({ game: { current, setCurrent } }) => {
  if (!current) {
    return (
      <Choose>
        <h2>Guess artist from:</h2>
        <Choose.Alternative
          onClick={() => setCurrent({ from: itemTypes.ALBUM })}
          role="link"
          label="From album"
        />
        <Choose.Alternative
          onClick={() => setCurrent({ from: itemTypes.TRACK })}
          role="link"
          label="From track"
        />
      </Choose>
    );
  }
  const { from } = current;
  return (
    <div>
      <br />
      <Question>
        Which artist created this&nbsp;
        {from.toLowerCase()}
        ?
      </Question>
      <br />
      <Switch equals={from}>
        <Switch.Case caseName={itemTypes.ALBUM}>
          <Album />
        </Switch.Case>
        <Switch.Case caseName={itemTypes.TRACK}>
          {itemTypes.TRACK}
        </Switch.Case>
      </Switch>
    </div>
  );
};

GuessArtist.propTypes = {
  game: Game.isRequired,
};

export default compose(
  inject('game'),
  observer,
)(GuessArtist);
