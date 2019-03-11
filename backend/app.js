const express = require('express');
const configRoutes = require('./routes');
const franc = require('franc');
const Sentiment = require('sentiment');
const Twitter = require('twitter');
const http = require('http');
const firebase = require('./database');

const sentiment = new Sentiment();
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

//Initialze Twitter client
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

//Client to track Google tweets
client.stream('statuses/filter', { track: 'Google' }, stream => {
  let sentimentScore = 0;
  let numTweets = 0;
  let languages = {};

  //Every minute actions for collecting out data
  setInterval(async () => {
    console.log(`Average sentiment = ${sentimentScore / numTweets}`);

    let eventObject = {
      time: new Date(),
      averageSentiment: sentimentScore / numTweets
    };

    io.to('Google').emit('new sentiment', eventObject);
    io.to('Google').emit('new language nums', languages);

    writeSentimentData(eventObject, 'Google');

    for (let key in languages) {
      count = await getLanguageCount(key, 'Google');
      count += languages[key];
      writeLanguageData(key, count, 'Google');
    }

    sentimentScore = 0;
    numTweets = 0;
    languages = {};
  }, 60 * 1000);

  //When a tweet is emitted over the stream
  stream.on('data', event => {
    let lang = franc(event.text);

    if (lang in languages) {
      languages[lang] += 1;
    } else {
      languages[lang] = 1;
    }

    if (lang == 'eng') {
      let tweetSentimentScore = sentiment.analyze(event.text);
      sentimentScore += tweetSentimentScore.comparative;
      numTweets++;
    }
  });

  stream.on('error', error => {
    throw error;
  });
});

//For when the client initially connects to the socket
io.on('connection', socket => {
  socket.on('room', async room => {
    const sentiment = await firebase.getSentimentScores(room);
    const languages = await firebase.getLanguageCounts(rooms);
    socket.emit('initial sentiment', sentiment);
    socket.emit('initial language count', languages);
    socket.join(room);
  });
});

configRoutes(app);

server.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
