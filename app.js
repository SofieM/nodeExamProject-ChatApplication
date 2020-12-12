const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
//Socket.io skal kaldes med en http-serveren (derfor loades http direkte ind med require - og serveren laves ovenfor)
//Selv om node bruger den "bagom" lige meget hvad (express bygger på http),
// er der behov for at have en "ren" http-instans til socketio
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', () => {
    console.log('New Websocket connection');
})

const port  = process.env.PORT || 3000;

server.listen(port, (error) => {
    if(error){
        console.log("Server couldn't start...", error);
    }
    console.log(`Server started on port ${port}`);
});