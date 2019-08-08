import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components';
import { PlayerIcon } from 'react-player-controls'

import Parser from './Parser'
import Marker from './components/Marker';
import GoogleMap from './components/GoogleMap';
import { HAIFA_PORT } from './consts/env';

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
      timestamps: [],
      snapshot: []
    };
  }

  componentDidMount() {
    fetch('data.json')
      .then(response => response.json())
      .then(data => this.setState({ timestamps: data.timestamps, snapshot: data.snapshot }));
  }

  componentWillMount() {
    Parser.getDataTest();
  }

  render() {
    const { timestamps, snapshot } = this.state;
    return (
      <Fragment>
        <Wrapper>
          <Fragment>
            {(!isEmpty(timestamps) || !isEmpty(snapshot)) && (
              <GoogleMap
                defaultZoom={11}
                defaultCenter={HAIFA_PORT}
              >
                {/* {timestamps.map(timestamp => (
                  <Marker
                    key={timestamp.id}
                    lat={timestamp.lat}
                    lng={timestamp.lng}
                  />
                ))} */}
                {snapshot.map(snap => (
                  <Marker
                    key={snap.id}
                    lat={snap.value.lat}
                    lng={snap.value.lon}
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
