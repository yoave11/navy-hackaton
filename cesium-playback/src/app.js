import React from "react";
import { hot } from "react-hot-loader/root";
import { Cartesian3 } from "cesium";
import { Viewer, Entity, CzmlDataSource } from "resium";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000'

import data from '../data'


class App extends React.Component {
  // constructor() {
  //   super()
  //   console.log(this)

  //   this.state = {
  //     shob: []
  //   }
  // }
  // componentWillMount() {
  //   const t1 = 1466400900
  //   const t2 = 1466480900
  //   axios.get(`?t1=${t1}&&t2=${t2}`).then(({ data }) => {
  //     console.log(data)
  //     this.setState({
  //       shob: data
  //     })
  //   }
  //   )

  // }
  render() {
    const t1 = 1466400900
    const t2 = 1466480900
    return (
      <Viewer full>
        <CzmlDataSource
          data={`http://localhost:4000?t1=${t1}&&t2=${t2}`}
          onLoad={console.log}
        />
      </Viewer>
    );
  }
}

export default hot(App);
