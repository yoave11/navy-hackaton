const uuidv1 = require('uuid/v1');
const chunk = {
    uuid: uuidv1(),
    timestamp: Date.now()
}

console.log(JSON.stringify(chunk, 'utf8'))
const kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    payloads = [
        {
            topic: 'updates',
            key: uuidv1(),
            messages: JSON.stringify(chunk, 'utf8'),
            partition: 0
        },
    ];

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});

producer.on('error', function (err) { })