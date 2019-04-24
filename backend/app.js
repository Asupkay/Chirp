const express = require('express');
const configRoutes = require('./routes');
const admin = require('firebase-admin');
const streams = require('./streams');
const news = require('./news');
const http = require('http');
const firebase = require('./database');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

//Intialize Streams
streams(io, 'Google');
streams(io, 'Facebook');

// Initialize Google News
news('Google');
news('Facebook');

//For when the client initially connects to the socket
io.on('connection', socket => {
  socket.on('room', async room => {
    const sentiment = await firebase.getSentimentScores(room);
    const languages = await firebase.getLanguageCounts(room);
    socket.emit('initial sentiment', sentiment);
    socket.emit('initial language count', languages);
    socket.join(room);
  });

  socket.on('changeRoom', async rooms => {
    const { newRoom, oldRoom } = rooms;
    socket.leave(oldRoom);
    const sentiment = await firebase.getSentimentScores(newRoom);
    const languages = await firebase.getLanguageCounts(newRoom);
    socket.emit('initial sentiment', sentiment);
    socket.emit('initial language count', languages);
    socket.join(newRoom);
  });
});

app.use(express.static(__dirname + './../frontend/build'));

configRoutes(app);

server.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
