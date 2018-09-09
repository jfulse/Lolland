import React from 'react';
import PropTypes from 'prop-types';
import { setStatic } from 'recompose';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const StyledButton = styled.button`
  margin: 10px;
  cursor: pointer;
  outline: none;
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  background: ${({ selected }) => (selected ? 'gray' : 'white')};

  &:disabled {
    cursor: default;
    color: lightgray;
  }
`;

const Alternative = ({
  onClick, label, role, disabled, selected,
}) => (
  <StyledButton
    onClick={onClick}
    type="button"
    role={role}
    disabled={disabled}
    selected={selected}
  >
    {label}
  </StyledButton>
);

Alternative.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  role: PropTypes.string,
  disabled: PropTypes.bool,
};

Alternative.defaultProps = {
  selected: false,
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

const Choose = ({ children, selectedId }) => (
  <StyledDiv>
    {React.Children.map(children, (element) => {
      const { props: { id } } = element;
      const selected = id === selectedId;
      return React.cloneElement(element, { selected });
    })}
  </StyledDiv>
);

Choose.propTypes = {
  children: Children.isRequired,
  selectedId: PropTypes.string.isRequired,
};

export default setStatic('Alternative', Alternative)(Choose);
