"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const app = (0, express_1.default)();
const port = 4007;
app.use(body_parser_1.default.json());
// Connect to RabbitMQ message broker
callback_api_1.default.connect('amqp://localhost', (err, connection) => {
    if (err) {
        throw err;
    }
    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        const exchangeName = 'transaction-exchange';
        const queueName = 'transaction-queue';
        // Create exchange and queue for transaction messages
        channel.assertExchange(exchangeName, 'direct', { durable: true });
        channel.assertQueue(queueName, { durable: true });
        // Bind queue to exchange with routing key of category name
        channel.bindQueue(queueName, exchangeName, '');
        app.post('/transaction', (req, res) => {
            const transaction = req.body;
            // Generate unique ID if not provided
            if (!transaction.uniqueID) {
                transaction.uniqueID = (0, uuid_1.v4)();
            }
            // Set initial status to inprogress
            transaction.status = 'inprogress';
            // Publish transaction to exchange with routing key of category name
            channel.publish(exchangeName, transaction.categoryName, Buffer.from(JSON.stringify(transaction)), { persistent: true });
            res.send('Transaction received and queued');
        });
    });
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map