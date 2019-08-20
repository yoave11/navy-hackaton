const redis = require("redis"),
    redisClient = redis.createClient();
let firstTimestamp = null
const { promisify } = require('util')
const czml = require('czml-writer')
const getObject = promisify(redisClient.get).bind(redisClient)
const interval = process.env.INTERVAL || 10000

const kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient()

const consumer = new Consumer(
    client,
    [
        { topic: 'updates', partition: 0, fromOffset: -1 }
    ],
    {
        autoCommit: false
    }
);

var orbit = new czml.orbit.fromParams({
    apogee: 426.9, // km
    perigee: 416.2, // km
    inclination: 51.65, // deg
    rightAscension: 304.1, // deg
    argumentOfPeriapsis: 117.8 // deg 
});
var output = orbit.czml();
delete output[1].path
console.log(output)
const createShob = ({entities}) => {
    console.log('fuck')
    console.log(Object.keys(entities))

    const s = Object.keys(entities).map(k => {
        let o = { ...JSON.parse(JSON.stringify(output[1])) }
        // delete o.availability
        o.id = k
        o.label.text = k
        o.position.cartographicDegrees = entities[k].position.cartesian
        delete o.position.cartesian
        // o.position.epoch = new Date(data.entities[k].position.epoch).toISOString()

        return o
    })
    s.unshift({
        ...output[0],
    })
    return s
}


const promisfySnapshotCalculation = (t1, t2, snapshot, offset) => new Promise((resolve, reject) => {
    console.log(`Reading from offset ${offset}`)
    consumer.setOffset('updates', 0, offset)
    let timestamps = {}
    let entities = {}
    consumer.on('message', ({ value, offset, highWaterOffset }, err) => {
        if (err) {
            console.log(err)

            reject(err)
        }
        if (highWaterOffset && offset == (highWaterOffset - 1)) {
            resolve({ entities, snapshot, })
        }
        const v = JSON.parse(value)
        const timestamp = v.kinematicTime

        if (!entities[v.key]) {
            entities[v.key] = {
                position: {
                    epoch: timestamp,
                    cartesian: []
                }
            }
        }
        entities[v.key].position.cartesian.push(
            timestamp - entities[v.key].position.epoch, v.lat, v.lon, 0
        )


        if (timestamp <= t1) {
            snapshot.push({
                id: v.key,
                value: v
            })
        }

        if (timestamp <= t2 && timestamp >= t1) {
            if (!timestamps[JSON.stringify(timestamp)]) {
                timestamps[JSON.stringify(timestamp)] = []
            }
            timestamps[JSON.stringify(timestamp)].push(v)
        }

        if (timestamp > t2) {
            resolve({ entities, snapshot, })
        }

    })
});

const calculateInitialSnapshot = async (t1, t2) => {
    const snapshotKey = Number(Math.floor((t1 - firstTimestamp) / interval)) * interval + Number(firstTimestamp)
    const value = JSON.parse(await getObject(snapshotKey))
    if (!value)
        return {}
    return promisfySnapshotCalculation(t1, t2, value.snapshot, value.offset)
}

const requestHandler = async ({ t1, t2 }) => {
    if (!firstTimestamp) {
        firstTimestamp = await getObject('firstTimestamp')
    }
    const res = await calculateInitialSnapshot(t1, t2)
    return createShob(res)
}

module.exports = requestHandler