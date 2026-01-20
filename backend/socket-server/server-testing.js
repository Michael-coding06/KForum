const http = require('http').createServer()

const io = require('socket.io')(http, {
    cors: {origin: "*"}
});  // Will fix this later

const redis = require('redis');

const subscriber = redis.createClient({
    url: 'redis://localhost:6379'  // Will put this into env
});

subscriber.on('error', (err) => console.log('Redis Client Error', err));
async function setupRedis() {
    await subscriber.connect();
    await subscriber.subscribe('comment_channel', (comment) => {
        console.log("New comment from Redis:", comment);

        io.emit('new_comment', JSON.parse(comment))
    });
}

setupRedis()

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
})













// const express = require('express');
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');
// const {availableParallelism} = require('node:os');
// const cluster = require('node:cluster'); // allow copy main process multiple times to run on different CPU coress
// const {createAdapter, setupPrimary} = require('@socket.io/cluster-adapter');

// if (cluster.isPrimary) {   // check if currently is Manager or Worker
//     const numCPUs = availableParallelism();
//     for (let i = 0; i < numCPUs; i ++) {
//         cluster.fork({
//             PORT: 4000 + i
//         }); // spawn new worker to run the script again
//     }

//     return setupPrimary(); // listener in primary process, listening to workers
// }

// // import os from "node:os"

// async function main() {
//     const app = express();
//     const server = createServer(app);
//     const _ = new Server(server, {
//         connectionStateRecovery: {},
//         adapter: createAdapter() // worker process uses this to talk to the primary
//     });

//     const port = process.env.PORT;
//     server.listen(port, () => {
//         console.log(`server running at http://localhost:${port}`);
//     })

// }

// main();







http.listen(4040, () => console.log('Listening on http://localhost: 4040'))