const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const exitChatButton = document.querySelector('.leave-chat');

// chat verlassen

exitChatButton.addEventListener('click', leaveChat)

// Username und Chatroom von URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

// Chatroom beitreten

socket.emit('joinRoom', { username, room });

// Chatroom und User

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

// Fängt Nachricht von Server
socket.on('message', message => {
  outputMessage(message);
  // Scrollt nach unten wenn Nachricht eingeht
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Nachricht übermitteln
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  // Nachricht wird an Server übermittelt
  socket.emit('chatMessage', message);
  // Input Feld leeren
  e.target.elements.message.value = '';
  e.target.elements.message.focus();
});

// Zeigt Nachricht in DOM an
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                  <p class="text">${message.text}</p>
                  `;
  document.querySelector('.chat-messages').appendChild(div);
};

// Chatroom Name zu Dom hinzufügen
function outputRoomName(room) {
  roomName.innerText = room;
};

// User zu DOM hinzufügen
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
};

// Chat verlassen

function leaveChat(e){
  e.preventDefault();
  window.location.href = '/';
}