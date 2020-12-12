//brugen af socket.io på klientsiden (scriptet kaldes i index.html) giver adgang til funktionen io
const socket = io();

//modtager event fra serveren: message
socket.on('message', (message) => {
    console.log(message);
});

//Dette skal nok laves med Ajax/fetch i stedet for
document.querySelector('#chat-form').addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = e.target.elements.message.value;
    
    //Sender eventet "sendmessage" til serveren
    //Acknowledgement: den der emitter et event, sætter en callback funktion op
    socket.emit('sendMessage', message, (message) => {
        console.log('The message was delivered!', message);
    });
});

//sender klientens geolocation, hvis klienten trykker på knappen 'send location'
document.querySelector('#send-location').addEventListener('click', () => {
    //hvis klientens browser ikke understøtter geolocation
   if(!navigator.geolocation) {
       return alert('Geolocation is not supported by your browser');
   }

   navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       }, () => {
           console.log('Location shared!')
       });
   });
});
