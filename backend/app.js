const express = require('express');
const configRoutes = require('./routes');
const franc = require('franc');
const Sentiment = require('sentiment');
const Twitter = require('twitter');
const http = require('http')
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const sentiment = new Sentiment();
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

//Initialze Firebase authentication
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const db = admin.database()

//Initialze Twitter client
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

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

//Client to track Google tweets
client.stream('statuses/filter', {track: 'Google'}, (stream) => {
  let sentimentScore = 0;
  let numTweets = 0;
  let languages = {};

  //Every minute actions for collecting out data
  setInterval(async () => {
    console.log(`Average sentiment = ${sentimentScore/numTweets}`);

    let eventObject = {
      time: new Date(),
      averageSentiment: sentimentScore/numTweets
    };

    io.to('Google').emit('new sentiment', eventObject);
    io.to('Google').emit('new language nums', languages); 

    writeSentimentData(eventObject, 'Google');

    for (let key in languages) {
      count = await getLanguageCount(key, 'Google');
      count += languages[key];
      writeLanguageData(key, count, 'Google');
    };
    
    sentimentScore = 0;
    numTweets = 0;
    languages = {};
  }, 60 * 1000)

  //When a tweet is emitted over the stream
  stream.on('data', (event) => {
    let lang = franc(event.text);

    if (lang in languages) {
      languages[lang] += 1;
    } else {
      languages[lang] = 1;
    };
    
    if(lang == 'eng') {
      let tweetSentimentScore = sentiment.analyze(event.text);
      sentimentScore += tweetSentimentScore.comparative;
      numTweets++;
    }

  });
  
  stream.on('error', (error) => {
    throw error;
  });
});

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
