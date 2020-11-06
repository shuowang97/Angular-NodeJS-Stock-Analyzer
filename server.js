const express = require('express');
const path = require('path');
const app = express();

const routes = require('./server/routes/routes');

// app.use() -> add middleware before server actually does anything
// make sure server knows that the whole /dist folder is static
app.use(express.static(path.join(__dirname, 'dist/ang-node')));
// everything goes to /posts get some specific response
app.use('/routes', routes);

// all of other requests will get to /dist/ang-node/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ang-node/index.html'));
});


// process.env.PORT the port nodejs is running
const port = process.env.PORT || 4600;

app.listen(port, (req, res) => {
  console.log(`Running on port ${port}`);
});
