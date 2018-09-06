import React from 'react';
import PropTypes from 'prop-types';
import { setStatic } from 'recompose';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const StyledButton = styled.button`
  margin: 10px;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const Alternative = ({
  onClick, label, role, disabled,
}) => (
  <StyledButton
    onClick={onClick}
    type="button"
    role={role}
    disabled={disabled}
  >
    {label}
  </StyledButton>
);

Alternative.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  role: PropTypes.string,
  disabled: PropTypes.bool,
};

Alternative.defaultProps = {
  role: 'button',
  disabled: false,
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 16px;
  }
`;

const Choose = ({ children }) => (
  <StyledDiv>
    {children}
  </StyledDiv>
);

Choose.propTypes = {
  children: Children.isRequired,
};

export default setStatic('Alternative', Alternative)(Choose);
