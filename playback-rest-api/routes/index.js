const express = require('express');
const router = express.Router();
const requestHandler = require('./requestHandler')
const Chance = require('chance')
var chance = new Chance();
/* GET home page. */
router.get('/', async (req, res, next) => {
  const answer = await requestHandler(req.query)
  res.send(answer);
});

var openConnections = [];

router.get('/stream', async (req, resp) => {
  req.socket.setTimeout(2 * 60 * 1000);
  resp.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  // resp.write('\n');
  // var d = new Date();
  // resp.write('id: ' + d.getMilliseconds() + '\n');

  // const firstPacket = {
  //   id: 'document',
  //   name: 'simple',
  //   version: '1.0',
  //   clock:
  //   {
  //     interval: '1970-01-17T23:20:00.000Z/1970-01-17T23:30:56.194Z',
  //     currentTime: '1970-01-17T23:20:00.000Z',
  //     multiplier: 20,
  //     range: 'LOOP_STOP',
  //     step: 'SYSTEM_CLOCK_MULTIPLIER'
  //   }
  // }
  // resp.write('data:' + JSON.stringify(firstPacket) + '\n\n'); // Note the extra newline
  openConnections.push(resp);

  await requestHandler(req.query, resp)

  req.on("close", function () {
    console.log('closed')
    var toRemove;
    for (var j = 0; j < openConnections.length; j++) {
      if (openConnections[j] == resp) {
        toRemove = j;
        break;
      }
    }
    openConnections.splice(j, 1);
  });

});

// setInterval(function() {
//     // we walk through each connection
//     openConnections.forEach(function(resp) {

//         // send doc
//         var d = new Date();
//         resp.write('id: ' + d.getMilliseconds() + '\n');
//         resp.write('data:' + createMsg() +   '\n\n'); // Note the extra newline
//     });

// }, 1000);

function createMsg() {
  var d = new Date();
  var entity = {
    "id": d.getMilliseconds(),
    "polyline": {
      "positions": {
        "cartographicDegrees": [
          chance.latitude(), chance.longitude(), 0
          , chance.latitude(), chance.longitude(), 0
        ]
      },
      "width": 2,
      "material":
      {
        "solidColor":
        {
          "color":
            { "rgba": [0, 0, 255, 255] }
        }
      }
    }
  };

  return JSON.stringify(entity);
}


module.exports = router;
