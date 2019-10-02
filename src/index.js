import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import http from 'http';
import socket from'socket.io';
import {generateMessage, generateLocation} from './utils/messages';
import { addUser, getUser ,getUsersInRoom ,removeUser} from './utils/users';
import db from './config/db';

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const staticPath = path.resolve(__dirname,'../public');

app.use(express.static(staticPath));

db.on('open', () => {
  console.log('Active Db connection');
});

db.on('error', () => {
  console.error('error connecting to db');
})

io.on('connection', (socket) => {
  console.log('New Connection Made!');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id, //the id for the connection
      username,
      room
    });

    if(error) {
      return callback(error);
    }

    socket.join(room);
    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast.to(room).emit('message', generateMessage(username, `${username} joined`));
    io.to(room).emit('roomData', {
      room: room,
      users: getUsersInRoom(room)
    });
    callback()
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', generateMessage(user.username || '',message));
    callback(); //acknowleged
  })


  socket.on('sendLocation',(location, callback) => {
    const user = getUser(socket.id);
    const mapUri = `https://www.google.com/maps?q=${location.lat},${location.long}`;
    io.to(user.room).emit('locationMessage', generateLocation(user.username || '', mapUri));
    callback();
  });


  //for disconnected  connections
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage('',`${user.username} left the group`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  })
});


server.listen(port, () => {
  console.log(`app currently running on http://localhost:${port}`)
});
 