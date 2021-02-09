require('dotenv').config();

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage  } = require('./utils/messages');
const app = express();

const server = http.createServer(app);
//Socket.io skal kaldes med en http-serveren (derfor loades http direkte ind med require - og serveren laves ovenfor)
//Selv om node bruger den "bagom" lige meget hvad (express bygger på http),
// er der behov for at have en "ren" http-instans til socketio
const io = socketio(server);

const login = require('./routes/login');
const users = require('./routes/users');
const register = require('./routes/register');

app.use(express.static('public'));

const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use('/login', login);
app.use('/users', users);
app.use('/register', register);

app.get('/', (req, res) =>{
    res.redirect('./login');
});

const chat = require('./routes/chat');
app.use('/chat/', chat);

io.on('connection', (socket) => {
    console.log('New Websocket connection');
    //socket.emit sender event til en specifik klient (til klientens socket)
    //sender et event = det selvlavede: message og en værdi (en velkomst-string),
    //Værdien kan bruges som det førte argument til callback funktionen hos klienten
    socket.emit('message','Admin', generateMessage('Welcome!'));

    //broadcast sender en besked til alle andre end den socket, det udgår fra
    socket.broadcast.emit('message', 'Admin', generateMessage('A new user has joined!'));

    //modtager eventet sendMessage fra klienten
    socket.on('sendMessage', (name, message, callback) => {
        //io.emit sender event til alle klienter, der er forbundet til serveren
        io.emit('message', name, generateMessage(message));
        //Aknowledgement: den der modtager et event (socket.on), modtager en callback-funktion,
        //som skal kaldes for at "aknowledge" overfor klienten
        callback('Delivered!');
    });

    socket.on('sendLocation', (name, coords, callback) => {
        io.emit('locationMessage', name, generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });
    
    socket.on('disconnect', () =>{
        io.emit('message', 'Admin', generateMessage('A user has left the chat!'))
    });
});

const port  = process.env.PORT || 3000;

server.listen(port, (error) => {
    if(error){
        console.log("Server couldn't start...", error);
    }
    console.log(`Server started on port ${port}`);
});