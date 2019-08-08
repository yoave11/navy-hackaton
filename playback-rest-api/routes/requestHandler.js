const redis = require("redis"),
    redisClient = redis.createClient();
let firstTimestamp = null
const { promisify } = require('util')
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

const promisfySnapshotCalculation = (t1, t2, snapshot, offset) => new Promise((resolve, reject) => {
    console.log(`Reading from offset ${offset}`)
    consumer.setOffset('updates', 0, offset)
    let timestamps = {}
    consumer.on('message', ({ value, offset, highWaterOffset }, err) => {
        if (err) {
            console.log(err)

            reject(err)
        }
        if (highWaterOffset && offset == (highWaterOffset - 1)) {
            resolve({ timestamps, snapshot })
        }
        const v = JSON.parse(value)
        const timestamp = v.kinematicTime
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
            resolve({ timestamps, snapshot })
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
    console.log(res.timestamps ? res.timestamps : 0)
    return res
}

module.exports = requestHandler