const socket = io();
const message = document.querySelector('#message');
const sendBtn = document.querySelector('#submit');
const locationBtn = document.querySelector('#location');
const messages = document.querySelector('#messages');
const form =  document.querySelector('#message-form');
const sideBar = document.querySelector('#sidebar');

message.focus();
//Templates
const template = document.querySelector('#message-temp').innerHTML;
const LocationTemp = document.querySelector('#message-location-temp').innerHTML;
const sidebarTemp = document.querySelector('#sidebar-temp').innerHTML;

// Options
const {username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true });
form.addEventListener('submit', function(e) {
  e.preventDefault();
  sendBtn.setAttribute('disabled','disabled');
   socket.emit('sendMessage', message.value, (mess) => {
    //acknowledging sent
   //console.log('message delivered', mess);
     message.value ='';
     message.focus();
     sendBtn.removeAttribute('disabled');
   })
});


const autoScroll = () => {
  const newMessage = messages.lastElementChild;

  // get the styles relating to element
  const newMessageStyle = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  // calculate the height
  const newMessageHeight = newMessage.offSetHeight + newMessageMargin;

  //visible height
  const visibleHeight = message.offSetHeight;

  //container height
  const containerHeight = messages.scrollHeight;

  //How far have the page scrolled
  const scrollOffset = message.scrollTop + visibleHeight;

  if(containerHeight - newMessageHeight <= scrollOffset) {
     messages.scrollTop = messages.scrollHeight
  }
}

socket.on('message',(message) => {
  const html = Mustache.render(template, {
     username: message.user,
    message: message.message,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML('beforeend', html)
  autoScroll();
})

socket.on('locationMessage', (url) => {
  const html = Mustache.render(LocationTemp, {
    username: message.user,
    url: url.uri,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML('beforeend', html)
  autoScroll();
})

const getLocation = () => {
  if (!navigator.geolocation) return console.error('geolocation not supported');
  navigator.geolocation.getCurrentPosition((position) => {
    locationBtn.setAttribute('disabled','disabled');
    socket.emit('sendLocation', {
      lat: position.coords.latitude,
      long: position.coords.longitude 
    }, () => {
       locationBtn.removeAttribute('disabled');
    });
  });
};

locationBtn.addEventListener('click', getLocation)

socket.emit('join', { username, room }, (error) => {
   if(error) {
      alert(error);
      location.href = '/';
   }
})

socket.on('roomData', ({ users, room }) => {
   const html = Mustache.render(sidebarTemp, {
      room,
      users
   });
   sideBar.innerHTML = html;
});