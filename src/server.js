const express = require('express');

const sites = require('./sites');

const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/sites.json', (req, res) => {
  sites(port).then(s => {
    res.json(s);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
