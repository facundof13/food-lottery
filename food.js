require('dotenv').config();

const googleMaps = require('@google/maps').createClient({
  key: "AIzaSyCoKs7KMvBcRsIt4thBeC8fmVq-c4fmkp4",
  Promise: Promise
});

let string = "Tacos";
let pos = [33.84217884331358, -84.10194936086585];



// async function getNearbyFood(string, lat, long) {
googleMaps.places({
    query: string,
    location: pos
  }, function (result) {
    console.log(result);
  }).asPromise()
  .then(function (response) {
    console.log(response.json.results);
  })
// }



// }

// module.exports = {
//   getNearbyFood: getNearbyFood
// }