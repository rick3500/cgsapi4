import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import amqp from 'amqplib/callback_api';

interface Transaction {
  uniqueID: string;
  requestName: string;
  categoryName: string;
  status: 'inprogress' | 'last';
  itemNumbers: number[];
  payload: any;
}

const app = express();
const port = 4007;

app.use(bodyParser.json());

// Connect to RabbitMQ message broker
amqp.connect('amqp://localhost', (err, connection) => {
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
      const transaction: Transaction = req.body;

      // Generate unique ID if not provided
      if (!transaction.uniqueID) {
        transaction.uniqueID = uuidv4();
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
