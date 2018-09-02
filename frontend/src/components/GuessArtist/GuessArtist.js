import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose, withProps, withState } from 'recompose';
import styled from 'styled-components';

import {
  Album, Choose, If, Switch,
} from '..';
import { itemTypes, resultTypes } from '../../constants';
import { Album as AlbumType, Collection, Game } from '../../propTypes';
import { random, noop } from '../../utils';

// TODO: Abstract guess from album to its own component

const Question = styled.h3`
  text-align: center;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 50px;
`;

const StyledButton = styled.button`
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    margin-right: 10px;
  }
`;

const AnnouncementWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 1px solid black;
  border-radius: 10px;
  max-width: 300px;
  margin: auto;
  font-size: 18px;
`;

const randomAlbum = async (albums, setAlbum) => {
  const { total } = await albums.fetch();
  const offset = random(total);
  const baseUrl = albums.url();
  const urlWithQuery = `${baseUrl}/?offset=${offset}`;
  albums.url = () => urlWithQuery; // eslint-disable-line no-param-reassign
  await albums.fetch();
  albums.url = () => baseUrl; // eslint-disable-line no-param-reassign
  const album = albums.get();
  setAlbum(album);
};

const initialAnswer = { value: '', result: resultTypes.PENDING };

class GuessArtist extends React.Component {
  constructor(props) {
    super(props);

    this.displayAnswer = this.displayAnswer.bind(this);
    this.newAlbum = this.newAlbum.bind(this);
  }

  displayAnswer() {
    const { setAnswer, game: { setShowAnswer } } = this.props;
    setShowAnswer(true);
    setAnswer(initialAnswer);
  }

  async newAlbum() {
    const {
      albums, setAlbum, setAnswer, game: { setShowAnswer },
    } = this.props;
    setShowAnswer(false);
    await randomAlbum(albums, setAlbum);
    setAnswer(initialAnswer);
  }

  render() {
    const {
      game: {
        showAnswer, current, setCurrent,
      },
      albums,
      album,
      setAlbum,
      answer,
      setAnswer,
      handleSubmit,
    } = this.props;

    if (!current) {
      return (
        <Choose>
          <h2>Guess artist from:</h2>
          <Choose.Alternative
            onClick={async () => {
              setCurrent({ from: itemTypes.ALBUM });
              await randomAlbum(albums, setAlbum);
            }}
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
    const inputDisabled = showAnswer || answer.result !== resultTypes.PENDING;

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
            <Album
              hideCover={!showAnswer}
              hideArtists={!showAnswer}
              album={album}
            />
          </Switch.Case>
          <Switch.Case caseName={itemTypes.TRACK}>
            {itemTypes.TRACK}
          </Switch.Case>
        </Switch>
        <ActionsWrapper>
          <StyledButton
            type="button"
            onClick={this.displayAnswer}
          >
            Show answer
          </StyledButton>
          <SubmitWrapper>
            <input
              value={answer.value}
              onChange={e => setAnswer({ ...answer, value: e.target.value })}
              placeholder="Write answer..."
              disabled={inputDisabled}
            />
            <StyledButton
              type="button"
              onClick={handleSubmit}
              disabled={inputDisabled}
            >
              Check answer
            </StyledButton>
          </SubmitWrapper>
          <StyledButton
            type="button"
            onClick={this.newAlbum}
          >
            New album
          </StyledButton>
        </ActionsWrapper>
        <If condition={answer.result === resultTypes.CORRECT}>
          <AnnouncementWrapper>
            Correct!
            &nbsp;
            <span role="img" aria-label="correct">🍾 🎉</span>
          </AnnouncementWrapper>
        </If>
        <If condition={answer.result === resultTypes.WRONG}>
          <AnnouncementWrapper>
            Wrong...
            &nbsp;
            <span role="img" aria-label="wrong">🤢 🤮</span>
          </AnnouncementWrapper>
        </If>
      </div>
    );
  }
}

GuessArtist.propTypes = {
  game: Game.isRequired,
  albums: Collection.isRequired,
  album: AlbumType,
  setAlbum: PropTypes.func.isRequired,
  answer: PropTypes.shape({
    value: PropTypes.string.isRequired,
    result: PropTypes.oneOf(Object.values(resultTypes)).isRequired,
  }),
  setAnswer: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

GuessArtist.defaultProps = {
  album: null,
  answer: initialAnswer,
};

const checkAlbumAnswer = (album, { value }, setAnswer) => {
  const artists = album.artists.map(({ name }) => name.toLowerCase());
  if (artists.includes(value)) setAnswer({ result: resultTypes.CORRECT, value: '' });
  else setAnswer({ result: resultTypes.WRONG, value: '' });
};

const withHandleSubmit = withProps(({
  album, answer, game, setAnswer,
}) => {
  let handleSubmit;
  if (game && game.current && game.current.from) {
    switch (game.current.from) {
      case itemTypes.ALBUM:
        return { handleSubmit: () => checkAlbumAnswer(album, answer, setAnswer) };
      default:
        handleSubmit = noop;
    }
  } else {
    handleSubmit = noop;
  }

  return { handleSubmit };
});

export default compose(
  inject('game'),
  inject('albums'),
  observer,
  withState('album', 'setAlbum', null),
  withState('answer', 'setAnswer', initialAnswer),
  withHandleSubmit,
)(GuessArtist);
