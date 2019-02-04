const express = require('express');
const configRoutes = require('./routes');
const Twitter = require('twitter');
require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

let num = 0;
client.stream('statuses/filter', {track: 'Google'}, (stream) => {
  stream.on('data', (event) => {
    const english = /^[A-Za-z0-9!?.@#$%^&*()\[\]"',+\-:i\/\s…’]*$/;

    if(english.test(event.text)) {
      console.log(event.text);
    }
    console.log(num);
    num++;
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
