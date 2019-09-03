import React from "react";
import { hot } from "react-hot-loader/root";
import { Cartesian3 } from "cesium";
import { Viewer, Entity, CzmlDataSource } from "resium";
import axios from 'axios';
import * as Cesium from 'cesium'
console.log(Cesium)
axios.defaults.baseURL = 'http://localhost:4000'

import data from '../data'


class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }
  componentDidMount() {
    // console.log(this.ref)
    // if (this.ref.current) {
    //   const viewer = this.ref.current.cesiumElement;
    //   console.log(this.ref)
    //   console.log(viewer)

    //   // some code
    // }
  }

  setRef(input) {
    console.log(input.props.cesium.viewer)
    let viewer = input.props.cesium.viewer
    const t1 = 1466400900
    const t2 = 1466480900
    const czmlStream = new Cesium.CzmlDataSource();
    const czmlStreamUrl = `http://localhost:4000/stream?t1=${t1}&&t2=${t2}`;

    // Setup EventSource
    let czmlEventSource = new EventSource(czmlStreamUrl);
    // Listen for EventSource data coming

    czmlStream.process({
      id: 'document',
      name: 'simple',
      version: '1.0',
      clock:
      {
        interval: '1970-01-17T23:20:00.000Z/1970-01-17T23:21:00.000Z',
        currentTime: '1970-01-17T23:20:00.000Z',
        multiplier: 2,
        range: 'LOOP_STOP',
        step: 'SYSTEM_CLOCK_MULTIPLIER'
      }
    })
    czmlEventSource.onmessage = function (e) {
      console.log(e)

      czmlStream.process(JSON.parse(e.data));
    }

    // Put the datasource into Cesium
    viewer.dataSources.add(czmlStream);
    this.childRef = input;
  }
  render() {

    return (
      <Viewer full>
        <CzmlDataSource
          ref={this.setRef}
          onLoad={console.log}
        />
      </Viewer>
    );
  }
}

export default hot(App);
