const allEntities = []
let lastTimestamp = null
let currentTimestamp = null
const redis = require("redis"),
    redisClient = redis.createClient();
const interval = process.env.INTERVAL || 10000
let lastOffset = 0


const recordHandler = ({ value, offset }) => {
    try {
        const v = JSON.parse(value)
        if (!lastTimestamp) {
            lastTimestamp = v.kinematicTime
        }
        currentTimestamp = v.kinematicTime
        if (currentTimestamp > (lastTimestamp + interval)) {
            const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            date.setUTCSeconds(lastTimestamp);
            console.log(`setting timestamp ${date} to redis`)
            redisClient.set(JSON.stringify(lastTimestamp), JSON.stringify({ snapshot: allEntities, offset: lastOffset }));
            lastOffset = offset
            lastTimestamp = interval + lastTimestamp
        }
        allEntities.push({
            id: v.key,
            value: v
        })

    } catch (e) {
        console.error(e)
    }
}

module.exports = recordHandler;