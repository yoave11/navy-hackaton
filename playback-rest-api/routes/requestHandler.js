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
console.log(output[0])
const createShob = (entities) => {

    const s = Object.keys(entities).map(k => {
        let o = { ...JSON.parse(JSON.stringify(output[1])) }
        // delete o.availability
        o.id = k
        o.label.text = k
        o.position.cartographicDegrees = entities[k].position.cartesian
        delete o.position.cartesian
        o.availability = '1970-01-17T23:00:00.000Z/1970-01-17T23:59:56.194Z'
        // console.log(entities[k].position)
        // console.log(new Date(entities[k].position.epoch).toISOString())
        o.position.epoch = new Date(entities[k].position.epoch).toISOString()
        // console.log(new Date(entities[k].position.epoch).toISOString())
        // delete o.position.epoch

        return o
    })
    // s.unshift({
    //     ...output[0],
    // })
    return s
}
const snapshotToCzml = (snapshot, timestamp) => snapshot.map(({ id, value }) => ({
    id,
    position: {
        epoch: timestamp,
        // cartesian: [new Date(timestamp).toISOString(), value.lat, value.lon, 0],
        cartesian: [0, value.lat, value.lon, 0]

    },
})).reduce((all, curr) => ({ ...all, [curr.id]: curr }), {})

const promisfySnapshotCalculation = (t1, t2, snapshot, offset, resp) => new Promise((resolve, reject) => {
    console.log(`Reading from offset ${offset}`)
    consumer.setOffset('updates', 0, offset)
    let entities = {}
    let snapshotSent = false
    const maxToSend = 500
    let numberOfMessages = 0
    consumer.on('message', ({ value, offset, highWaterOffset }, err) => {
        if (err) {
            console.log(err)

            reject(err)
        }

        if (snapshotSent) {
            numberOfMessages += 1
        }

        if (highWaterOffset && offset == (highWaterOffset - 1)) {
            const a = createShob(entities)
            a.forEach(d => {
                // resp.write('id: ' + d.id + '\n');
                resp.write('data:' + JSON.stringify(d) + '\n\n'); // Note the extra newline
            })
            resolve()
        }
        const v = JSON.parse(value)
        const timestamp = v.kinematicTime
        if (timestamp > t1) {
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
                // new Date(timestamp).toISOString(), v.lat, v.lon, 0
                // new Date().toISOString(), v.lat, v.lon, 0


            )
        }

        if (timestamp > t1 && !snapshotSent) {
            snapshotSent = true
            console.log('sending snapshot')
            const a = createShob(snapshotToCzml(snapshot, timestamp))
            sendToEventStream(a, resp)
        }

        if (timestamp <= t1) {
            snapshot.push({
                id: v.key,
                value: v
            })
        }

        if (timestamp > t2) {
            const a = createShob(entities)
            sendToEventStream(a,resp)
            resolve()
        }

        if (snapshotSent && numberOfMessages >= maxToSend) {
            // console.log('sending entities')
            // console.log(Object.keys(entities).length )

            const a = createShob(entities)
            sendToEventStream(a,resp)
            entities = {}
            numberOfMessages = 0
        }

    })
});

const sendToEventStream = (a, resp) => a.forEach(d => {
    resp.write('id: ' + d.id + '\n');
    resp.write('data:' + JSON.stringify(d) + '\n\n'); // Note the extra newline
})

const calculateInitialSnapshot = async (t1, t2, resp) => {
    const snapshotKey = Number(Math.floor((t1 - firstTimestamp) / interval)) * interval + Number(firstTimestamp)
    const value = JSON.parse(await getObject(snapshotKey))
    if (!value)
        return {}
    return promisfySnapshotCalculation(t1, t2, value.snapshot, value.offset, resp)
}

const requestHandler = async ({ t1, t2 }, resp) => {
    if (!firstTimestamp) {
        firstTimestamp = await getObject('firstTimestamp')
    }
    const res = await calculateInitialSnapshot(t1, t2, resp)
    return
    // return createShob(res.entities)
}

module.exports = requestHandler