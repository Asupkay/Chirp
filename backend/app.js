const express = require('express');
const configRoutes = require('./routes');
const franc = require('franc');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const Twitter = require('twitter');
require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {track: 'Google'}, (stream) => {
  let sentimentScore = 0;
  let numTweets = 0;

  setInterval(() => {
    console.log(`Average sentiment = ${sentimentScore/numTweets}`);
    sentimentScore = 0;
    numTweets = 0;
  }, 60 * 1000)

  stream.on('data', (event) => {
    let lang = franc(event.text);

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

const app = express();

configRoutes(app);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
