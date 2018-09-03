import React from 'react';
import { compose, setStatic } from 'recompose';
import styled from 'styled-components';

import { Children } from '../../propTypes';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: relative;
  min-height: 150px;
  flex-grow: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-shadow: 0 0 10px black;
  color: #fdfdfd;
  z-index: 2;
  padding: 10px;
`;

const Cell = styled.div`
  display: inline-block;
  margin: 5px 0;
`;

const Table = ({ children }) => (
  <Wrapper>
    {children}
  </Wrapper>
);

Table.propTypes = {
  children: Children.isRequired,
};

export default compose(
  setStatic('Column', Column),
  setStatic('Cell', Cell),
)(Table);
