import styled from 'styled-components';

export default styled.div`
  background-image: ${({ image }) => `url(${image})`};
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
