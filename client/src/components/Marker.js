import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  background-color: white;
  border: 1px solid black;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  &:hover {
    z-index: 1;
  }
`;

const Marker = props => (
  <Wrapper
    alt={props.text}
    src={props.image}
  />
);

export default Marker;
