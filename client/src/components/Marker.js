import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.img`
  /* position: absolute; */
  width: 15px;
  height: 15px;
  &:hover {
    z-index: 1;
  }
`;

const Marker = props => (
  <Wrapper
    alt={props.text}
    src={'boat-icon.png'}
  />
);

export default Marker;
