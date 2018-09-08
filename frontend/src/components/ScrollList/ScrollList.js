import styled from 'styled-components';

export default styled.div`
  max-height: ${({ maxHeight }) => maxHeight || '72px'};
  max-width: ${({ maxWidth }) => maxWidth || '350px'};
  display: inline-block;
  overflow: scroll;
  z-index: 30;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  padding-right: 17px;
`;
