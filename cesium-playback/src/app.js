import React from "react";
import { hot } from "react-hot-loader/root";
import { Cartesian3 } from "cesium";
import { Viewer, Entity, CzmlDataSource } from "resium";
import czml from "czml-writer";
// var data = require("json-loader!../data.json");
import data from '../data'

var orbit = new czml.orbit.fromParams({
  apogee: 426.9, // km
  perigee: 416.2, // km
  inclination: 51.65, // deg
  rightAscension: 304.1, // deg
  argumentOfPeriapsis: 117.8 // deg 
});
var output = orbit.czml();
delete output[1].path

const shob = Object.keys(data.entities).map(k => {

  let o = { ...JSON.parse(JSON.stringify(output[1])) }
  // delete o.availability
  o.id = k
  o.label.text = k
  o.position.cartographicDegrees = data.entities[k].position.cartesian
  delete o.position.cartesian
  // o.position.epoch = new Date(data.entities[k].position.epoch).toISOString()

  return o
})

shob.unshift({
  ...output[0],
  // clock: {
  //   ...output[0].clock,
  //   currentTime: "1970-01-17T00:00:00.00Z",
  //   interval: "1970-01-17T19:45:00.00Z/1970-01-17T21:00:00.00Z"
  // }
})
console.log(shob)


console.log(output)

// fetch('../data.json')
//             .then((response) => {

//                 console.log(response.json()) ;
//             })
//             .then((data) => {
//                 console.log(data);
//             }).catch(function (error) {
//                 console.log(error);
//         });

// delete output[1].availability
const App = () => (
  <Viewer full>

    <CzmlDataSource
      data={shob}
    />
  </Viewer>
);

export default hot(App);
