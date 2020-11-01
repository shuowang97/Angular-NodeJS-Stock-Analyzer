const express = require('express');
const router = express.Router();
const axios = require('axios');
const PostAPI = 'https://jsonplaceholder.typicode.com';


router.get('/', (req, res) => {
  res.send("it works");
})

// Get Post
router.get('/posts', (req, res) => {
  // res.send("Posts works");
  axios.get(`${PostAPI}/posts`).then(posts => {
    res.status(posts.status).json(posts.data);
  }).catch(error => {
    res.status(500).send(error);
  })
})



module.exports = router;
