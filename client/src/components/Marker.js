import React from 'react';
import styled from 'styled-components';

const ImageMarker = styled.img`
  width: 15px;
  height: 15px;
  &:hover {
    z-index: 1;
  }
`;

const SimpleMarker = styled.div`
  width: 15px;
  height: 15px;
  background-color: black;
  border: 1px solid white;
  border-radius: 100%;
  &:hover {
    z-index: 1;
  }
`;

const Marker = props => (
  <SimpleMarker />
  // <ImageMarker src={'boat-icon.png'} />
);

export default Marker;
