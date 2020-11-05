
const express = require('express');
const router = express.Router();
const axios = require('axios');
const PostAPI = 'https://jsonplaceholder.typicode.com';

const tiingoKEY = 'b46119b62502a8ecc7e70d99b7c265bd9fbfd39d';
// const tiingoKEY = '3f19da6b56850f57435309e27dc47433e95b7631';


const utilityUrl = 'https://api.tiingo.com/tiingo/utilities/search/';
const descriptionUrl = 'https://api.tiingo.com/tiingo/daily/';
const lastPriceUrl = 'https://api.tiingo.com/iex';
const newsUrl = 'https://newsapi.org/v2/everything?apiKey=bbef8dd425204e818bbead05dd243053&q=';
const util = require('util');
const historicalUrl = 'https://api.tiingo.com/tiingo/daily/%s/prices?startDate=%s&resampleFreq=daily&token=b46119b62502a8ecc7e70d99b7c265bd9fbfd39d';


router.get('/', (req, res) => {
  res.send("it works");
});

router.get('/lastprice/:id', (req, res) => {
  let ticker = req.params.id;
  let reqUrl =  lastPriceUrl + '?tickers=' + ticker + '&token=' + tiingoKEY;
  axios.get(reqUrl).then(price => {
    res.json(price.data);
  });
});

router.get('/companyinfo/:id', (req, res) => {
  let ticker = req.params.id;
  let reqUrl = descriptionUrl + ticker + '?token=' + tiingoKEY;
  axios.get(reqUrl).then(info => {
    res.json(info.data);
  });
});

router.get('/news/:id', (req, res) => {
  let ticker = req.params.id;
  let reqUrl = newsUrl + ticker;
  axios.get(reqUrl).then(info => {
    res.json(info.data);
  });
});
router.get('/history/:id', (req, res) => {
  let ticker = req.params.id;
  let d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  let dString = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 1);
  let reqUrl = util.format(historicalUrl, ticker, dString);
  console.log(reqUrl);
  axios.get(reqUrl).then(info => {
    res.json(info.data);
  });
});

router.get('/utility/:id', (req, res) => {
  let ticker = req.params.id;
  ticker = ticker.trim();
  console.log(ticker);
  if (ticker === '' || ticker.length === 0) {
    ticker = '0';
  }
  let reqUrl = utilityUrl + ticker + '?token=' + tiingoKEY;
  console.log('1', reqUrl);
  axios.get(reqUrl).then(info => {
    res.json(info.data);
  });
});


// Get Post
router.get('/posts', (req, res) => {
  // res.send("Posts works");
  axios.get(`${PostAPI}/posts`).then(posts => {
    res.status(posts.status).json(posts.data);
  }).catch(error => {
    res.status(500).send(error);
  })
});



module.exports = router;
