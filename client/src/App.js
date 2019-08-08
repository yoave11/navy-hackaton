import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components';
import axios from 'axios';
import { PlayerIcon } from 'react-player-controls'


import Marker from './components/Marker';
import GoogleMap from './components/GoogleMap';
import { PLAYBACK_SERVICE_URL_TEST, PLAYBACK_SERVICE_URL, HAIFA_PORT } from './consts/env';

const Wrapper = styled.section`
  width: 100vw;
  height: 90vh;
`;

const Centered = styled.div`
  margin: auto;
  width: 20%;
  border: 3px solid black;
  padding: 10px;
  text-align:center;
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
      <Fragment>
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
        <Centered>
          <PlayerIcon.Play width={30} height={30} />
          <PlayerIcon.Pause width={30} height={30} />
          <PlayerIcon.Previous width={30} height={30} />
          <PlayerIcon.Next width={30} height={30} />
        </Centered>
      </Fragment>
    );
  }
}

export default Main;
