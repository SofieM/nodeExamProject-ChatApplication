//brugen af socket.io på klientsiden (scriptet kaldes i index.html) giver adgang til funktionen io
const socket = io();

//Elements
const $chatForm = document.querySelector('#chat-form');
const $chatFormInput = $chatForm.querySelector('input');
const $chatFormButton = $chatForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;

//modtager event fra serveren 'message'
socket.on('message', (message) => {
    console.log(message);
    //De beskeder, der sendes mellem server i klient indsættes i min html template vha. mustache
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
   console.log(message.url);
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('H:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

$chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //disable, så klienten ikke kan trykke på send knappen, før eventet er aknowledged
    $chatFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    
    //Sender eventet "sendmessage" til serveren
    //Acknowledgement: den der emitter et event, sætter en callback funktion op
    socket.emit('sendMessage', message, () => {
        //enable - når serveren svarer, at beskeden er modtaget, så kan knappen benyttes igen
        $chatFormButton.removeAttribute('disabled');
        //det klienten har skrevet i input-feltet slettes, når beskeden er sendt
        $chatFormInput.value = '';
        //flytter curseren ind i input-feltet, så det er ligetil at skrive ny besked
        $chatFormInput.focus();
        console.log('The message was delivered!');
    });
});
//kan dette laves med fetch??
//sender klientens geolocation, hvis klienten trykker på knappen 'send location'
$sendLocationButton.addEventListener('click', () => {
    //hvis klientens browser ikke understøtter geolocation
   if(!navigator.geolocation) {
       return alert('Geolocation is not supported by your browser');
   }
    //disable
    $sendLocationButton.setAttribute('disabled', 'disabled');
   
   navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       }, () => {
           console.log('Location shared!')
           //enable
           $sendLocationButton.removeAttribute('disabled');
       });
   });
});
