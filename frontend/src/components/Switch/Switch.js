import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { setStatic } from 'recompose';

import { Children } from '../../propTypes';

const StyledDiv = styled.div`
`;

const Case = ({ children }) => (
  <StyledDiv>
    {children}
  </StyledDiv>
);

Case.propTypes = {
  children: Children.isRequired,
};

const Switch = ({ children, equals }) => (
  <div>
    {React.Children.map(children, (child) => {
      const { props: { caseName } } = child;
      if (caseName === equals) return child;
      return null;
    })}
  </div>
);

Switch.propTypes = {
  children: Children.isRequired,
  equals: PropTypes.string,
};

Switch.defaultProps = {
  equals: null,
};

export default setStatic('Case', Case)(Switch);
