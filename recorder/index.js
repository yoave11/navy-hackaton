const allEntities = []

const kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'entities', partition: 0 , fromOffset: -1}
        ],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
    console.log(message);
});