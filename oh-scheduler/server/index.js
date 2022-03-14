// server/index.js

const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/listing", async (req, res) => {
  let bounds = req.body;

  let data = await redfinFacade.getOpenHouseListing(bounds.tl_lat, bounds.tl_lng, bounds.br_lat, bounds.br_lng);
  let jsonString = data.substring(4);
  console.log(jsonString);

  res.json(JSON.parse(jsonString));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const redfinFacade = {

  async getOpenHouseListing(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {
      console.log(`Server receive request: top_left_lat ${topLeftLat} top_left_lng ${topLeftLng} bottom_right_lat ${bottomRightLat} bottom_right_lng ${bottomRightLng}`);
      let getRequestUrl = generateGetOpenHouseListingUrl(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng);
      let response = await fetch(getRequestUrl);
      let data = await response.text();
      return data;
  },

}

function generateGetOpenHouseListingUrl(topLeftLat, topLeftLng, bottomRightLat, bottomRightLng) {
  let url = "https://www.redfin.com/stingray/api/gis?al=1&market=seattle&num_homes=350&open_house=2&ord=redfin-recommended-asc&page_number=1&sf=1,2,5,6,7&start=0&status=1&uipt=1,2,3,4,5,6,7,8&v=8";
  let polyquery = `&poly=${topLeftLng}%20${topLeftLat}%2C${bottomRightLng}%20${topLeftLat}%2C${bottomRightLng}%20${bottomRightLat}%2C${topLeftLng}%20${bottomRightLat}%2C${topLeftLng}%20${topLeftLat}`;
  
  return url + polyquery;
}
