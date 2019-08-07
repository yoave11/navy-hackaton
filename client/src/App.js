import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components';
import axios from 'axios';

import Marker from './components/Marker';
import GoogleMap from './components/GoogleMap';
import HAIFA_PORT from './consts/haifa_port';

const url = 'https://httpbin.org/get';
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
    this.getDataAxios()
  }

  async getDataAxios() {
    const response =
      await axios.get(url,
        {
          params: {
            start: '123456789',
            end: '123456789'
          }
        }
      )
    console.log(response.data)
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
                  image={place.icon}
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
