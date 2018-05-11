const express = require('express');

const sites = require('./sites');

const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res, next) => {
  sites(port).then(s => {
    res.send(s);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
