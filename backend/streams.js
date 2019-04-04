const Twitter = require('twitter');
const franc = require('franc');
const Sentiment = require('sentiment');
const firebase = require('./database');
const sentiment = new Sentiment();

//Initialze Twitter client
const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const initializeStreams = io => {
  //Client to track Google tweets
  client.stream('statuses/filter', { track: 'Google' }, stream => {
    let sentimentScore = 0;
    let numTweets = 0;
    let languages = {};

    //Every minute actions for collecting out data
    setInterval(async () => {
      console.log(`Average sentiment = ${sentimentScore / numTweets}`);

      let eventObject = {
        time: +new Date(),
        averageSentiment: sentimentScore / numTweets
      };

      io.to('Google').emit('new sentiment', eventObject);
      io.to('Google').emit('new language nums', languages);

      firebase.writeSentimentData(eventObject, 'Google');

      for (let key in languages) {
        count = await firebase.getLanguageCount(key, 'Google');
        count += languages[key];
        firebase.writeLanguageData(key, count, 'Google');
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
};

module.exports = initializeStreams;
