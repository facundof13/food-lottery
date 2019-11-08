require("dotenv").config();
const express = require("express");
const food = require("./food");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const app = express();
app.listen(process.env.PORT || 3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

app.get("/api/:searchstring&:lat&:long", (request, response) => {
  const searchstring = request.params.searchstring;
  const lat = request.params.lat;
  const long = request.params.long;

  if (searchstring !== "" && searchstring !== null) {
    if (lat !== null && long !== null) {
      food
        .callPlacesAPI(searchstring, lat, long)
        .then(res => response.send(res));
    }
  } else {
    response.send("Incorrect Parameters");
  }
});

app.post("/api/zipsearch", (req, res) => {
  const zip = req.body.zip;
  if (zip.match(/\d{5}/gm)) {
    // convert zip to lat-long
    food.geoCode(zip).then(coords => {
      console.log(coords,req.body.searchString)
      food
        .callPlacesAPI(req.body.searchString, coords.lat, coords.lng)
        .then(data => res.send(data));
    });
  }
});

module.exports = app;
