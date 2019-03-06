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

// const firebase = require('firebase');

// const config = {
//   apiKey: process.env.DB_API_KEY,
//   authDomain: process.env.DB_AUTH_DOMAIN,
//   databaseURL: process.env.DB_URL,
//   storageBucket: process.env.STORAGE_BUCKET
// };

// firebase.initializeApp(config);

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const db = admin.database()

const writeSentimentData = (sentimentScore) => {
  db.ref('google/'+timeStamp).set({
    sentiment_score: sentimentScore
  });
};

const writeLanguageData = (language, count) => {
  db.ref(`language/${language}`).set({
    count: count
  });
};

const getSentimentScores = async (company) => {
  const sentiment = await db.ref(company+'/').once('value');
  return sentiment.val();
};

const getLanguageCount = async (language) => {
  const lang = await db.ref(language+'/').once('value');
  let lang_value = lang.val();
  if (lang_value == null) {
    lang_value = 0;
  };
  return lang_value;
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
  let languages = {};

  setInterval(async () => {
    console.log(`Average sentiment = ${sentimentScore/numTweets}`);

    let eventObject = {
      time: new Date(),
      averageSentiment: sentimentScore/numTweets
    };

    io.to('Google').emit('new sentiment', eventObject);
    io.to('Google').emit('new language nums', languages); 

    writeSentimentData(sentimentScore/numTweets);

    for (let key in languages) {
      count = await getLanguageCount(key);
      // console.log(key, count);
      count += languages[key];
      writeLanguageData(key, count);
    };
    
    sentimentScore = 0;
    numTweets = 0;
    languages = {};
  }, 60 * 1000)

  stream.on('data', (event) => {
    let lang = franc(event.text);
    date = new Date();
    timeStamp = date;

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
