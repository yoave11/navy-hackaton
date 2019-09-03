import React from "react";
import { hot } from "react-hot-loader/root";
import { Viewer, CzmlDataSource } from "resium";

class App extends React.Component {
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
