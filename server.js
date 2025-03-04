require('dotenv').config();
const { refreshTwitchToken, getTwitchToken } = require('./twitchAuth');
const { connectYoutube } = require('./youtube');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const tmi = require('tmi.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

async function connectTwitch() {
    // let token = await getTwitchToken();
    // console.log("Access Token:", token);

    const twitchClient = new tmi.Client({
        // options: { debug: true },
        // identity: {
        //     username: process.env.JONATHAN_TWITCH_USERNAME,
        //     password: `oauth:${token}`
        // },
        channels: [process.env.SARAH_TWITCH_CHANNEL]
    });

    twitchClient.connect();

    twitchClient.on('message', (channel, tags, message, self) => {
        if (self) return;
        console.log(`[Twitch] ${tags.username}: ${message}`);
        io.emit('chatMessage', { platform: 'twitch', user: tags.username, message });
    });

    twitchClient.on('disconnected', async (reason) => {
        console.log("Twitch disconnected:", reason);
        console.log("Refreshing token...");
        await refreshTwitchToken();
        connectTwitch();
    });
}

connectTwitch();
// connectYoutube();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);
    const pingInterval = setInterval(() => {
        console.log("Sending pings to client...");
        socket.emit("ping");
        socket.emit("PING :tmi.twitch.tv");
    }, 240000)
    socket.on("pong", () => {
        console.log("Received pong from client");
    })
    socket.on('disconnect', () => console.log("Client disconnected"));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});