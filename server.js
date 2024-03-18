const express = require('express')
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { getCurrentUser,userJoin,userLeave, getRoomUsers } = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatBox Bot';
// setting Static files
app.use(express.static(path.join(__dirname,'public')));

// Establishing a connection
io.on('connection',socket => {

    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);
    // Sending to a single client
        socket.emit('message',formatMessage(botName,'welcome to chatbox'));

    // Broadcasting the message except one who is sending
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,
            `${user.username} has joined the chat`));

    // get all users of specific rooms
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    })
       
    // Listening the typed message
    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,message));
    });

    // When a user disconnected
    socket.on('disconnect',() => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message',
            formatMessage(botName,`${user.username} has left the room`));
            
            
     
        
        }


    });

})

const PORT =3000||process.env.PORT;

// Listening to a server
server.listen(PORT,() => {
    console.log(`Server is running on ${PORT}`);
})