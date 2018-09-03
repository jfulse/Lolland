import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { compose, withProps, withState } from 'recompose';
import styled from 'styled-components';

import {
  Album, Choose, If, Switch, Track,
} from '..';
import { itemTypes, resultTypes } from '../../constants';
import {
  Album as AlbumType, Track as TrackType, Collection, Game,
} from '../../propTypes';
import { random, noop } from '../../utils';

// TODO: Abstract guess from album to its own component

const Wrapper = styled.div`
  padding: 50px;
`;

const Question = styled.h3`
  display: flex;
  justify-content: space-between;
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
  let { total } = albums;
  if (!total) {
    const { total: fetchedTotal } = await albums.fetch();
    total = fetchedTotal;
    albums.setTotal(fetchedTotal);
  }
  const offset = random(total);
  const baseUrl = albums.url();
  const urlWithQuery = `${baseUrl}/?offset=${offset}`;
  albums.url = () => urlWithQuery; // eslint-disable-line no-param-reassign
  await albums.fetch();
  albums.url = () => baseUrl; // eslint-disable-line no-param-reassign
  const album = albums.get();
  setAlbum(album);
};

const randomTrack = async (tracks, setTrack) => {
  let { total } = tracks;
  if (!total) {
    const { total: fetchedTotal } = await tracks.fetch();
    total = fetchedTotal;
    tracks.setTotal(fetchedTotal);
  }
  const offset = random(total);
  const baseUrl = tracks.url();
  const urlWithQuery = `${baseUrl}/?offset=${offset}`;
  tracks.url = () => urlWithQuery; // eslint-disable-line no-param-reassign
  await tracks.fetch();
  tracks.url = () => baseUrl; // eslint-disable-line no-param-reassign
  const track = tracks.get();
  setTrack(track);
};

const initialAnswer = { value: '', result: resultTypes.PENDING };

class GuessArtist extends React.Component {
  constructor(props) {
    super(props);

    this.newAlbum = this.newAlbum.bind(this);
    this.newTrack = this.newTrack.bind(this);
    this.new = this.new.bind(this);
  }

  async newAlbum() {
    const {
      albums,
      answer: { result },
      setAlbum,
      setAnswer,
      game: { showAnswer, setShowAnswer, increaseWrong },
    } = this.props;

    if (!showAnswer && result === resultTypes.PENDING) {
      increaseWrong();
    }
    setShowAnswer(false);
    await randomAlbum(albums, setAlbum);
    setAnswer(initialAnswer);
  }

  async newTrack() {
    const {
      tracks,
      answer: { result },
      setTrack,
      setAnswer,
      game: { showAnswer, setShowAnswer, increaseWrong },
    } = this.props;

    if (!showAnswer && result === resultTypes.PENDING) {
      increaseWrong();
    }
    setShowAnswer(false);
    await randomTrack(tracks, setTrack);
    setAnswer(initialAnswer);
  }

  async new() {
    const { game: { current: { from } } } = this.props;
    switch (from) {
      case itemTypes.ALBUM:
        await this.newAlbum();
        break;
      case itemTypes.TRACK:
        await this.newTrack();
        break;
      default:
        break;
    }
  }

  render() {
    const {
      game: {
        showAnswer, current, setCurrent, nCorrect, nWrong,
      },
      albums,
      album,
      setAlbum,
      tracks,
      track,
      setTrack,
      answer,
      setAnswer,
      handleSubmit,
      displayAnswer,
    } = this.props;
    const inputDisabled = showAnswer || answer.result !== resultTypes.PENDING;
    const submitDisabled = inputDisabled || !answer.value;

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
            label="Album"
          />
          <Choose.Alternative
            onClick={async () => {
              setCurrent({ from: itemTypes.TRACK });
              await randomTrack(tracks, setTrack);
            }}
            role="link"
            label="Track"
          />
        </Choose>
      );
    }

    return (
      <Wrapper>
        <br />
        <Question>
          <span>
            Which artist created this&nbsp;
            {current.from.toLowerCase()}
            ?
          </span>
          <span>
            {nCorrect}
            &nbsp;/&nbsp;
            {nCorrect + nWrong}
            &nbsp; correct
          </span>
        </Question>
        <br />
        <Switch equals={current.from}>
          <Switch.Case caseName={itemTypes.ALBUM}>
            <Album
              hideCover={!showAnswer}
              hideArtists={!showAnswer}
              album={album}
            />
          </Switch.Case>
          <Switch.Case caseName={itemTypes.TRACK}>
            <Track
              hideCover={!showAnswer}
              hideArtists={!showAnswer}
              hideAlbum={!showAnswer}
              track={track}
            />
          </Switch.Case>
        </Switch>
        <ActionsWrapper>
          <StyledButton
            type="button"
            onClick={displayAnswer}
            disabled={showAnswer}
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
              disabled={submitDisabled}
            >
              Check answer
            </StyledButton>
          </SubmitWrapper>
          <StyledButton
            type="button"
            onClick={this.new}
          >
            Next
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
      </Wrapper>
    );
  }
}

GuessArtist.propTypes = {
  game: Game.isRequired,
  albums: Collection.isRequired,
  album: AlbumType,
  setAlbum: PropTypes.func.isRequired,
  tracks: Collection.isRequired,
  track: TrackType,
  setTrack: PropTypes.func.isRequired,
  answer: PropTypes.shape({
    value: PropTypes.string.isRequired,
    result: PropTypes.oneOf(Object.values(resultTypes)).isRequired,
  }),
  setAnswer: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  displayAnswer: PropTypes.func.isRequired,
};

GuessArtist.defaultProps = {
  album: null,
  track: null,
  answer: initialAnswer,
};

const withDisplayAnswer = withProps(({
  answer: { result },
  game: { setShowAnswer, increaseWrong },
}) => ({
  displayAnswer: ({ doNotCount }) => {
    if (result === resultTypes.PENDING && !doNotCount) {
      increaseWrong();
    }
    setShowAnswer(true);
  },
}));

const checkAlbumAnswer = (album, { value }) => {
  const artists = album.artists.map(({ name }) => name.toLowerCase());
  if (artists.includes(value.toLowerCase())) return true;
  return false;
};

const checkTrackAnswer = (track, { value }) => {
  const artists = track.artists.map(({ name }) => name.toLowerCase());
  if (artists.includes(value.toLowerCase())) return true;
  return false;
};

const withHandleSubmit = withProps(({
  album, track, answer, game, setAnswer, displayAnswer,
}) => {
  let check;
  let solution;
  if (game && game.current && game.current.from) {
    switch (game.current.from) {
      case itemTypes.ALBUM: {
        check = checkAlbumAnswer;
        solution = album;
        break;
      }
      case itemTypes.TRACK: {
        check = checkTrackAnswer;
        solution = track;
        break;
      }
      default:
        break;
    }
  }

  if (check && solution) {
    const { increaseCorrect, increaseWrong } = game;
    const handleSubmit = () => {
      const isCorrect = check(solution, answer);
      if (isCorrect) {
        setAnswer({ result: resultTypes.CORRECT, value: '' });
        increaseCorrect();
      } else {
        setAnswer({ result: resultTypes.WRONG, value: '' });
        increaseWrong();
      }
      displayAnswer({ doNotCount: true });
    };
    return { handleSubmit };
  }

  return { handleSubmit: noop };
});

export default compose(
  inject('game'),
  inject('albums'),
  inject('tracks'),
  withState('album', 'setAlbum', null),
  withState('track', 'setTrack', null),
  withState('answer', 'setAnswer', initialAnswer),
  withDisplayAnswer,
  withHandleSubmit,
  observer,
)(GuessArtist);
