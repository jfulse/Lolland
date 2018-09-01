import React from 'react';
import { DotLoader } from 'react-spinners';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const Loader = () => (
  <LoaderWrapper>
    <DotLoader />
  </LoaderWrapper>
);

export default Loader;
