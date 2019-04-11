const express = require('express');
const configRoutes = require('./routes');
const admin = require('firebase-admin');
const streams = require('./streams');
const news = require('./news');
const http = require('http');
const firebase = require('./database');

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

require('dotenv').config();

//Intialize Streams
streams(io);

// Initialize Google News
news('Google');

//For when the client initially connects to the socket
io.on('connection', socket => {
  socket.on('room', async room => {
    const sentiment = await firebase.getSentimentScores(room);
    const languages = await firebase.getLanguageCounts(room);
    socket.emit('initial sentiment', sentiment);
    socket.emit('initial language count', languages);
    socket.join(room);
  });
});

app.use(express.static(__dirname + './../frontend/build'));

configRoutes(app);

// eventObject = {
//   status: 'ok',
//   totalResults: 6,
//   articles: [
//     {
//       source: [Object],
//       author: 'Stefan Etienne',
//       title: 'Most Pixel buyers are jumping ship from Samsung, study shows',
//       description:
//         'The Google Pixel 3 was successful at making other Android device users switch, but it still struggles with converting iPhone users.',
//       url:
//         'https://www.theverge.com/2019/4/10/18304499/google-pixel-3-buyers-samsung-switch-study-purchases',
//       urlToImage:
//         'https://cdn.vox-cdn.com/thumbor/FrZoGzZuOg5B7YC18BolliAo5zk=/0x146:2040x1214/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/13278387/jbareham_181010_2989_0217.jpg',
//       publishedAt: '2019-04-10T14:34:43Z',
//       content:
//         'Googles latest Pixel smartphones are catching on, mostly by taking users away from other Android smartphone makers. According to a new study published by CounterPoint Research, more than half of Pixel 3 converts were previously using a Samsung phone.\r\nSpecifi… [+1162 chars]'
//     },
//     {
//       source: [Object],
//       author: 'Ann M. Ravel',
//       title:
//         'For true transparency around political advertising, U.S. tech companies must collaborate',
//       description:
//         'In October 2017 online giants Twitter, Facebook, and Google announced plans to voluntarily increase transparency for political advertising on their platforms. The three plans to tackle disinformation had roughly the same structure: funder disclaimers on polit…',
//       url:
//         'https://techcrunch.com/2019/04/10/for-true-transparency-around-political-advertising-u-s-tech-companies-must-collaborate/',
//       urlToImage:
//         'https://techcrunch.com/wp-content/uploads/2015/10/electionad-e1445861814943.jpg?w=719',
//       publishedAt: '2019-04-10T13:30:01Z',
//       content:
//         'In October 2017 online giants Twitter, Facebook, and Google announced plans to voluntarily increase transparency for political advertising on their platforms. The three plans to tackle disinformation had roughly the same structure: funder disclaimers on polit… [+6765 chars]'
//     },
//     {
//       source: [Object],
//       author: 'PTI',
//       title:
//         'How is Google’s GPay operating without authorisation: Delhi HC asks RBI',
//       description:
//         'The petition by Abhijit Mishra sought a direction to the RBI to order Google to “immediately” stop GPay’s “unauthorised operation” in India.',
//       url:
//         'https://www.thehindu.com/business/Industry/how-is-googles-gpay-operating-without-authorisation-delhi-hc-asks-rbi/article26796388.ece',
//       urlToImage:
//         'https://www.thehindu.com/business/Industry/3g114d/article26796387.ece/ALTERNATES/LANDSCAPE_615/vbk-GooglePay',
//       publishedAt: '2019-04-10T12:50:16Z',
//       content:
//         'The Delhi High Court on Wednesday asked the Reserve Bank of India (RBI) as to how was GPay, Googles mobile payment app, facilitating financial transactions without its authorisation.\r\nA Bench of Chief Justice Rajendra Menon and Justice A.J. Bhambhani posed th… [+2893 chars]'
//     },
//     {
//       source: [Object],
//       author: 'Ingrid Lunden',
//       title:
//         'Innovation Endeavors debuts Deep Life, an incubator focused on intersection of life science and computer science',
//       description:
//         'Innovation Endeavors, the fund backed by Google’s Eric Schmidt, has for years now been taking a novel approach to working on difficult and still-evolving problems like cybersecurity and food shortages: it sets up incubators that bring together different stake…',
//       url:
//         'https://techcrunch.com/2019/04/10/innovation-endeavors-debuts-deep-life-an-incubator-focused-on-intersection-of-life-science-and-computer-science/',
//       urlToImage:
//         'https://techcrunch.com/wp-content/uploads/2018/04/biotech-molecules.jpg?w=587',
//       publishedAt: '2019-04-10T12:21:21Z',
//       content:
//         'Innovation Endeavors, the fund backed by Google’s Eric Schmidt, has for years now been taking a novel approach to working on difficult and still-evolving problems like cybersecurity and food shortages: it sets up incubators that bring together different stake… [+3809 chars]'
//     },
//     {
//       source: [Object],
//       author: 'Shirin Ghaffary',
//       title:
//         'Recode Daily: China considers putting the brakes on crypto mining',
//       description:
//         'Plus: Google’s cofounders are notably MIA at company meetings, Congress holds a committee about white nationalism on social media, and Facebook says it’s using AI to be more respectful of friends who’ve passed away',
//       url:
//         'https://www.recode.net/2019/4/10/18303612/china-cryptocurrency-mining-bitcoin-google-sergey-brin-larry-page-tgif-facebook-youtube-congress',
//       urlToImage:
//         'https://cdn.vox-cdn.com/thumbor/CBFCT1Az20q2CQ42IYncO3sSGJE=/0x0:4272x2237/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/10709631/bitcoin_eyes.jpg',
//       publishedAt: '2019-04-10T12:11:42Z',
//       content:
//         'China may ban bitcoin and other cryptocurrency mining.The country, which is home to the worlds largest cryptocurrency mining farms, may put a stop to the practice. Authorities are concerned that the data centers hosting the mining machines are contributing to… [+4044 chars]'
//     }
//   ]
// };

// Object.entries(eventObject.articles).forEach(([key, value]) =>
//   console.log(value.author)
// );

server.listen(3000, async () => {
  console.log('Server running on http://localhost:3000');
});
