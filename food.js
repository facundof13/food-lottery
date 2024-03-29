require("dotenv").config();

const googleMaps = require("@google/maps").createClient({
  key: process.env.API_KEY,
  Promise: Promise
});

// let string = "Tacos";
// let pos = [33.84217884331358, -84.10194936086585];

// callPlacesAPI(string, pos[0], pos[1])
//   .then(response => {
//     response.forEach((place) => {
//       console.log(place);
//     })
//   });

async function callPlacesAPI(place, lat, long) {
  return new Promise(async (resolve, reject) => {
    await googleMaps
      .places({
        query: place,
        radius: 2000,
        location: [lat, long],
        type: "restaurant"
      })
      .asPromise()
      .then(function(response) {
        let filteredResults = [];
        for (let i = 0; i < response.json.results.length; i++) {
          found = false;
          for (let j = 0; j < filteredResults.length; j++) {
            if (filteredResults[j].name == response.json.results[i].name) {
              found = true;
            }
          }
          if (!found) filteredResults.push(response.json.results[i]);
        }

        resolve(filteredResults);
        //   for (let i = 0; i < filteredResults.length; i++) {
        //     console.log(filteredResults[i].name);
        //   }
        //   console.log(filteredResults.length);
      });
  });
}

function geoCode(zip) {
  return new Promise((res, rej) => {
    googleMaps.geocode(
      {
        address: zip
      },
      function(err, response) {
        if (!err) {
          res(response.json.results[0].geometry.location);
        }
      }
    );
  });
}

module.exports = {
  callPlacesAPI: callPlacesAPI,
  geoCode: geoCode
};
