require('dotenv').config()
const express = require('express');
const food = require('./food');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
app.listen(process.env.port || 3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

app.use(compression());
app.use(helmet());


app.get('/api/:searchstring&:lat&:long', (request, response) => {
  const searchstring = request.params.searchstring;
  const lat = request.params.lat;
  const long = request.params.long;

  if (searchstring !== '' && searchstring !== null) {
    if (lat !== null && long !== null) {
      food.callPlacesAPI(searchstring, lat, long)
        .then(res => response.send(res));
    }
  }
});

module.exports = app;