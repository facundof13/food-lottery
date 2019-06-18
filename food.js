require('dotenv').config();

const googleMaps = require('@google/maps').createClient({
  key: process.env.API_KEY
});

let string = "Tacos";
let pos = [33.84217884331358, -84.10194936086585];

// getNearbyFood(string, pos[0], pos[1])
// .then(result => {
//   console.log(result);
// })


// async function getNearbyFood(string, lat, long) {

//   }, function(result) {
//     console.log(result);
//   })

test();

function test() {
 googleMaps.places({
    query: 'fast food',
    language: 'en',
    location: [33.842, -84.101],
    radius: 5000
  }, response => {
    console.log(response.json.results);
  });
}



// }

// module.exports = {
//   getNearbyFood: getNearbyFood
// }