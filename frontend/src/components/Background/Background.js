import styled from 'styled-components';

const defaultBackground = `linear-gradient(
  135deg,
  #4c4c4c 0%,
  #595959 12%,
  #666666 25%,
  #474747 33%,
  #2c2c2c 41%,
  #111111 60%,
  #000000 70%,
  #000000 70%,
  #2b2b2b 75%,
  #1c1c1c 85%,
  #131313 100%
);`;

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
