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

io.on('connection', (socket) => {
    console.log('New Websocket connection');
    //socket.emit sender event til en specifik klient (til klientens socket)
    //sender et event = det selvlavede: message og en værdi (en velkomst-string),
    //Værdien kan bruges som det førte argument til callback funktionen hos klienten
    socket.emit('message', 'Welcome!');

    //broadcast sender en besked til alle andre end den socket, det udgår fra
    socket.broadcast.emit('message', 'A new user has joined');

    //modtager eventet sendMessage fra klienten
    socket.on('sendMessage', (message, callback) => {
        //io.emit sender event til alle klienter, der er forbundet til serveren
        io.emit('message', message);
        //Aknowledgement: den der modtager et event (socket.on), modtager en callback-funktion,
        //som skal kaldes for at "aknowledge" overfor klienten
        callback('Delivered!');
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    });
    
    socket.on('disconnect', () =>{
        io.emit('message', 'A user has left!')
    });
});

const port  = process.env.PORT || 3000;

server.listen(port, (error) => {
    if(error){
        console.log("Server couldn't start...", error);
    }
    console.log(`Server started on port ${port}`);
});