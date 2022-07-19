require('dotenv').config();

const amqp = require('amqplib');

const server = process.env.RABBITMQ_SERVER;
const queue = process.env.RABBITMQ_QUEUE;

amqp.connect(server, (err0, connection) => {
    if (err0) {
        throw err0;
    }
    connection.createChannel((err1, channel) => {
        if (err1) {
            throw err1;
        }
        channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            const { to, body } = JSON.parse(msg.content.toString());
            console.log('sending email to: ', to)
            console.log(body);
            channel.ack(msg);
        }, { noAck: false });
    });
});