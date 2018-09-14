import React from 'react';
import { inject, observer } from 'mobx-react';
import { branch, compose, renderNothing } from 'recompose';
import styled from 'styled-components';

import {
  Album, Artist, Playlist, Track,
} from '../../components';
import { Popups } from '../../propTypes';

const components = ({
  Album,
  Artist,
  Playlist,
  Track,
});

const PopupWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupBackground = styled.div`
  position: absolute;
  width: 100%;
  flex-direction: column;
  background: #fffffff0;
  top: 0;
  height: 100%;
`;

const PopupTitle = styled.h2`
  text-align: center;
`;

const PopupBox = styled.div`
    position: relative;
    background: white;
    padding: 0 60px 30px 60px;
    border-radius: 10px;
    border: 1px solid black;
    margin-top: -200px;
    width: fit-content;
`;

const Popup = ({
  popups: {
    name, props, title, closePopup,
  },
}) => {
  const Component = components[name] || (() => null);
  return (
    <PopupWrapper>
      <PopupBackground onClick={closePopup} />
      <PopupBox>
        {title && <PopupTitle>{title}</PopupTitle>}
        <Component {...props} />
      </PopupBox>
    </PopupWrapper>
  );
};

Popup.propTypes = {
  popups: Popups.isRequired,
};

export default compose(
  inject('popups'),
  observer,
  branch(
    ({ popups: { isOpen } }) => !isOpen,
    renderNothing,
  ),
)(Popup);
