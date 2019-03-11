const express = require('express');
const configRoutes = require('./routes');
const http = require('http')
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const streams = require('streams');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

//Intiialize Streams
streams.initializeStreams(io);

//Initialze Firebase authentication
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const db = admin.database()

//Write sentiment data for a company at a timestamp
const writeSentimentData = (eventObject, company) => {
  db.ref(`${company}/sentiment/${eventObject.time}`).set({
    averageSentiment: eventObject.averageSentiment
  });
};

//Writes language count about company
const writeLanguageData = (language, count, company) => {
  db.ref(`${company}/language/${language}`).set({
    count: count
  });
};

//Get all the sentiment scores of a company
const getSentimentScores = async (company) => {
  const sentiment = await db.ref(`${company}/sentiment/`).once('value');
  return sentiment.val();
};

//Get the language count of a particular language and company
const getLanguageCount = async (language, company) => {
  const lang = await db.ref(`${company}/language/${language}/`).once('value');
  let langValue = lang.val();
  if (langValue == null) {
    langValue = 0;
  } else {
    langValue = langValue.count;
  };
  return langValue;
};

//Gets all counts of languages
const getLanguageCounts = async (company) => {
  const langs = await db.ref(`${company}/language`).once('value');
  let langsValue = langs.val();
  return langsValue;   
}


//For when the client initially connects to the socket
io.on('connection', (socket) => {
  socket.on('room', async (room) => {
    const sentiment = await getSentimentScores(room);
    const languages = await getLanguageCounts(rooms);
    socket.emit('initial sentiment', sentiment);
    socket.emit('initial language count', languages);
    socket.join(room);
  });
});

configRoutes(app);

server.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
