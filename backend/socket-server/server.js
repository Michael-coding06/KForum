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

http.listen(4040, () => console.log('Listening on http://localhost: 4040'))