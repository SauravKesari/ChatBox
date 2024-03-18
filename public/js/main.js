const chatForm = document.getElementById('chat-form');
const chatMessagesContainer = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const socket= io();


const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true,
});

// Message from server

socket.emit('joinRoom',{username,room});

socket.on('message',message => {
    displayMessage(message);

    // Scroll down to latest message
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
})


// Users list of particular room
socket.on('roomUsers', ({room,users}) => {
    displayRoomUsers(users);
    displayRoomName(room);
})

// Sending message to server
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //Extracting input value 
    const msg= document.getElementById('msg').value;
    
    // Sending data to server
    socket.emit('chatMessage',msg);

    // Clearing input and setting focus again
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Displaying message at a client side

function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);

}


function displayRoomName(room){
    document.getElementById('room-name').innerText = room;
}
function displayRoomUsers(users){
    userList.innerHTML = `
     ${users.map(user => `<li>${user.username}</li>`).join('')}`;   
}