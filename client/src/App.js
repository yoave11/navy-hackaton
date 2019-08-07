import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import HAIFA_PORT from './consts/haifa_port';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const API_KEY = "AIzaSyDulrR4TYXf5MncVDZgzZmNB_2ZlEsVrVY";

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 14
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={HAIFA_PORT}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
