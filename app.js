require('dotenv').config()
const express = require('express');
const nearbyFood = require('./food');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));


app.get('/api/:searchstring&:lat&:long',  (request, response) => {
  const searchstring = request.params.searchstring;
  const lat = request.params.lat;
  const long = request.params.long;

  const result = nearbyFood.getNearbyFood(searchstring, lat, long);
  console.log(result);
  // .then(result => {
  //   response.send(result);
  // })

});

module.exports = app;