import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPanel = styled.div`
  width: ${({ width }) => width};
  min-width: ${({ minWidth }) => minWidth};
  border: 1px solid black;
`;

const Panel = ({ children, width, minWidth }) => (
  <Wrapper>
    <StyledPanel width={width} minWidth={minWidth}>
      {children}
    </StyledPanel>
  </Wrapper>
);

Panel.propTypes = {
  children: Children.isRequired,
  width: PropTypes.string,
  minWidth: PropTypes.string,
};

Panel.defaultProps = {
  width: '90%',
  minWidth: '0',
};

export default Panel;
