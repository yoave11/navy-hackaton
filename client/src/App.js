import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components';
import axios from 'axios';

import Marker from './components/Marker';
import GoogleMap from './components/GoogleMap';
import { PLAYBACK_SERVICE_URL_TEST, PLAYBACK_SERVICE_URL, HAIFA_PORT } from './consts/env';

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
`;

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
    };
  }

  componentDidMount() {
    fetch('places.json')
      .then(response => response.json())
      .then(data => this.setState({ places: data.results }));
  }

  componentWillMount() {
    this.getDataTest()
    // this.getData()
  }

  async getDataTest() {
    await axios.get(PLAYBACK_SERVICE_URL_TEST)
  }

  async getData() {
    await axios.get(PLAYBACK_SERVICE_URL,
      {
        params: {
          t1: '1466400700',
          t2: '1466480900'
        }
      }
    )
  }

  render() {
    const { places } = this.state;
    return (
      <Wrapper>
        <Fragment>
          {!isEmpty(places) && (
            <GoogleMap
              defaultZoom={11}
              defaultCenter={HAIFA_PORT}
            >
              {places.map(place => (
                <Marker
                  key={place.id}
                  text={place.name}
                  lat={place.geometry.location.lat}
                  lng={place.geometry.location.lng}
                />
              ))}
            </GoogleMap>
          )}
        </Fragment>
      </Wrapper>
    );
  }
}

export default Main;
