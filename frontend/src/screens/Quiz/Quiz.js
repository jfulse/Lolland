import React from 'react';
import { inject, observer } from 'mobx-react';
import { compose } from 'recompose';
import styled from 'styled-components';

import {
  Album, Result, Submit, Switch, Track,
} from '../../components';
import { Game, Route } from '../../propTypes';
import { itemTypes } from '../../constants';

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h3`
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  width: 100%;
`;

const InvisibleSpan = styled.span`
  opacity: 0;
`;

class Quiz extends React.Component {
  async componentDidMount() {
    const {
      route: { push },
      game: {
        getRandomFrom,
        currentGame: { type: { from, to } },
      },
    } = this.props;
    if (from == null || to == null) {
      push('/');
    } else {
      await getRandomFrom();
    }
  }

  componentDidUpdate() {
    const {
      route: { push },
      game: { currentGame: { type: { from, to } } },
    } = this.props;
    if (from == null || to == null) {
      push('/');
    }
  }

  render() {
    const {
      game: {
        currentGame: {
          correctAnswers,
          wrongAnswers,
          settings: { autoplay, showAlbumBackground },
          state: { fromItem, showAnswer, toItems },
          type: { from, to },
        },
      },
    } = this.props;
    return (
      <Wrapper>
        <Header>
          <InvisibleSpan>
            {'x'.repeat(12)}
          </InvisibleSpan>
          <span>
            Guess the
            {' '}
            {(to || '').toLowerCase()}
          </span>
          <span>
            {correctAnswers}
            {' / '}
            {correctAnswers + wrongAnswers}
            {' correct'}
          </span>
        </Header>
        <Switch equals={from}>
          <Switch.Case caseName={itemTypes.ALBUM}>
            <Album
              album={fromItem}
              hideArtists={!showAnswer}
              hideCover={!showAnswer}
              hideTracks={!showAnswer}
              emphasize={showAnswer && to}
              autoplay={autoplay}
              showAlbumBackground={showAnswer || showAlbumBackground}
            />
          </Switch.Case>
          <Switch.Case caseName={itemTypes.TRACK}>
            <Track
              track={fromItem}
              hideArtists={!showAnswer}
              hideAlbum={!showAnswer}
              hidePlaylist={!showAnswer}
              hideCover={!showAnswer}
              emphasize={showAnswer && to}
              context={{ type: to, item: toItems[0] }}
              autoplay={autoplay}
              showAlbumBackground={showAnswer || showAlbumBackground}
            />
          </Switch.Case>
        </Switch>
        <br />
        <Submit />
        <Result />
      </Wrapper>
    );
  }
}

Quiz.propTypes = {
  game: Game.isRequired,
  route: Route.isRequired,
};

export default compose(
  inject('game'),
  inject('route'),
  observer,
)(Quiz);
