import styled from 'styled-components';

import { defaultBackground } from '../../styles';

export default styled.div`
  background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : undefined)};
  background: ${({ imageUrl }) => (!imageUrl ? defaultBackground : undefined)};
  filter: blur(3px) opacity(0.6);
  background-position: center;
  top: auto;
  bottom: auto;
  left: auto;
  right: auto;
  width: 100%;
  height: 100%;
  position: absolute;
`;
