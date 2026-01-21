require('dotenv').config();
const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: {origin: process.env.FRONTEND_ORIGIN}
});  

const redis = require('redis');

const subscriber = redis.createClient({
    url: process.env.REDIS_URL  
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

http.listen(process.env.SOCKET_PORT, () => {
  console.log(`Listening on http://localhost:${process.env.SOCKET_PORT}`);
});