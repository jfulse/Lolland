import React from 'react';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPanel = styled.div`
  width: 90%;
  min-width: 500px;
  border: 1px solid black;
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
