const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { availableParallelism } = require('node:os');
const cluster = require('node:cluster');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

const redis = require('redis');


if (cluster.isPrimary) {
    const numCPUs = availableParallelism(); // number of logical processors
    for (let i = 0; i < numCPUs; i ++) {
        cluster.fork({
            PORT: 4000 + i
        });
    }
    return setupPrimary();
}

async function main() {
    const app = express();
    const server = createServer(app);

    const io = new Server(server, {
        connectionStateRecovery: {},
        adapter: createAdapter(),
        cors: { origin: "*" }
    });

    const subscriber = redis.createClient({
        url: 'redis://localhost:6379'
    });

    subscriber.on('error', (err) => console.log('Redis Client Error: ', err));
    await subscriber.connect();
    await subscriber.subscribe('comment_channel', (comment) => {
        console.log(`Worker ${process.pid} received:`, comment);
        io.emit('new_comment', JSON.parse(comment));
    });

    io.on('connection', (socket) => {
        socket.emit('identity', {
            pid: process.pid,
            port: port
        })
        console.log(`User ${socket.id} connected to worker ${process.pid}`);
    });

    const port = process.env.PORT || 4000;
    server.listen(port, () => {
        console.log(`Worker ${process.pid} running at http://localhost:${port}`);
    });
}

main()