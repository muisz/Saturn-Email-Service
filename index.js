require('dotenv').config();

const amqp = require('amqplib/callback_api');
const mailer = require('./mailer');

const server = process.env.RABBITMQ_SERVER;
const queue = process.env.QUEUE;

amqp.connect(server, (err0, connection) => {
    if (err0) {
        throw err0;
    }
    console.log(`server connected and ready to receive message`);
    connection.createChannel((err1, channel) => {
        if (err1) {
            throw err1;
        }
        channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            const { to, subject, body } = JSON.parse(msg.content.toString());
            mailer.sendMail({
                sender: process.env.STMP_USER,
                to,
                subject,
                html: body,
            });
            console.log(`[+] email sent to ${to}`);
            channel.ack(msg);
        }, { noAck: false });
    });
});