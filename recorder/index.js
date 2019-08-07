const recordHandler = require('./recordHandler')
const kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'updates', partition: 0 , fromOffset: -1}
        ],
        {
            autoCommit: false
        }
    );

consumer.on('message', recordHandler)