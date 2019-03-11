const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

require('dotenv').config();

//Initialze Firebase authentication
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const db = admin.database();

const exportedMethods = {
  //Write sentiment data for a company at a timestamp
  async writeSentimentData(eventObject, company) {
    db.ref(`${company}/sentiment/${eventObject.time}`).set({
      averageSentiment: eventObject.averageSentiment
    });
  },

  //Writes language count about company
  async writeLanguageData(language, count, company) {
    db.ref(`${company}/language/${language}`).set({
      count: count
    });
  },

  //Get all the sentiment scores of a company
  async getSentimentScores(company) {
    const sentiment = await db.ref(`${company}/sentiment/`).once('value');
    return sentiment.val();
  },

  //Get the language count of a particular language and company
  async getLanguageCount(language, company) {
    const lang = await db.ref(`${company}/language/${language}/`).once('value');
    let langValue = lang.val();
    if (langValue == null) {
      langValue = 0;
    } else {
      langValue = langValue.count;
    }
    return langValue;
  },

  //Gets all counts of languages
  async getLanguageCounts(company) {
    const langs = await db.ref(`${company}/language`).once('value');
    let langsValue = langs.val();
    return langsValue;
  }
};

module.exports = exportedMethods;
