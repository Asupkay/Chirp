const NewsAPI = require('newsapi');
const firebase = require('./database');

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const getNews = company => {
  setInterval(async () => {
    newsapi.v2
      .topHeadlines({
        q: company,
        language: 'en'
      })
      .then(response => {
        console.log(response);
        Object.entries(response.articles).forEach(([key, value]) => {
          let eventObject = {
            time: +new Date(),
            title: value.title,
            author: value.author,
            description: value.description,
            url: value.url
          };
          console.log(eventObject);
          firebase.writeNewsData(eventObject, company);
        });
      });
  }, 15 * 60 * 1000);
};

module.exports = getNews;
