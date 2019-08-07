const allEntities = []
let lastTimestamp = null
let currentTimestamp = null
const redis = require("redis"),
    redisClient = redis.createClient();
const interval = process.env.INTERVAL || 1000
let lastOffset = 0


const recordHandler = ({ value, offset, key }) => {
    try {
        const v = JSON.parse(value)
        if (!lastTimestamp) {
            lastTimestamp = v.timestamp
        }
        currentTimestamp = v.timestamp
        if (currentTimestamp > (lastTimestamp + interval)) {
            console.log(`setting timestamp ${new Date(lastTimestamp)} to redis`) 
            redisClient.set(JSON.stringify(lastTimestamp), JSON.stringify({ snapshot: allEntities, offset: lastOffset }));
            lastOffset = offset
            lastTimestamp = interval + lastTimestamp
        }

        allEntities.push({
            uuid: v.uuid,
            value: v
        })

    } catch (e) {
        console.error(e)
    }
}

module.exports = recordHandler;