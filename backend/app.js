const express = require('express');
const configRoutes = require('./routes');
const franc = require('franc');
const Sentiment = require('sentiment');
const Twitter = require('twitter');
const http = require('http')

const sentiment = new Sentiment();
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

const firebase = require('firebase');

const config = {
  apiKey: process.env.DB_API_KEY,
  authDomain: process.env.DB_AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  storageBucket: process.env.STORAGE_BUCKET
};

firebase.initializeApp(config);

const writeSentimentData = (sentimentScore, timeStamp) => {
  firebase.database().ref('google/'+timeStamp).set({
    sentiment_score: sentimentScore
  });
};

const getSentimentScores = async (company) => {
  const sentiment = await firebase.database().ref(company+'/').once('value');
  return sentiment.val();
};

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {track: 'Google'}, (stream) => {
  let sentimentScore = 0;
  let numTweets = 0;
  let date = 0;

  setInterval(() => {
    console.log(`Average sentiment = ${sentimentScore/numTweets}`);

    let eventObject = {
      time: new Date(),
      averageSentiment: sentimentScore/numTweets
    };

    io.to('Google').emit('new sentiment', eventObject);

    writeSentimentData(sentimentScore/numTweets, timeStamp);
    sentimentScore = 0;
    numTweets = 0;
  }, 60 * 1000)

  stream.on('data', (event) => {
    let lang = franc(event.text);
    date = new Date();
    timeStamp = date;

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

io.on('connection', (socket) => {
  socket.on('room', async (room) => {
    const sentiment = await getSentimentScores(room);
    socket.emit('Initial sentiment', sentiment);
    socket.join(room);
  });
});

configRoutes(app);


server.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
  const sentiment = await getSentimentScores('google');
  console.log(sentiment);
});
