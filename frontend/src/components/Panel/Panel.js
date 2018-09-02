import React from 'react';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPanel = styled.div`
  width: 80%;
  min-width: 500px;
  border: 1px solid black;
  padding: 20px;
`;

const Panel = ({ children }) => (
  <Wrapper>
    <StyledPanel>
      {children}
    </StyledPanel>
  </Wrapper>
);

Panel.propTypes = {
  children: Children.isRequired,
};

export default Panel;
