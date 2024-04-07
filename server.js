const express = require('express');
const https = require('https');
const parser = require('iptv-playlist-parser');
const axios = require('axios');
const app = express();
const port = 9000;

const dataset = {
  "tt0051744": { name: "House on Haunted Hill", type: "movie", infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960" },
  "tt1254207": { name: "Big Buck Bunny", type: "movie", url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" },
  "tt0031051": { name: "The Arizona Kid", type: "movie", ytId: "m3BKVSpP80s" },
  "tt0137523": { name: "Fight Club", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1927002.mkv" },
  "tt0120737": { name: "The Lord of the Rings: The Fellowship of the Ring", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1932197.mp4" },
  "tt0096697:35:1": { name: "The Simpsons", type: "series", url: "http://zaktv.city:80/series/temtesfay1055/telegram4321/2106939.mkv" },
};

async function fetchIMDbIDOrTitle(title) {
  try {
    const query = encodeURIComponent(title);
    const url = `https://www.omdbapi.com/?t=${query}&apikey=1ff254ef`;
    const response = await axios.get(url);
    console.log(response.data)

    if (response.data && response.data.Response === "True") {
      // If the IMDb ID is found, return it
      return response.data.imdbID;
    } else {
      // If not found, return the original title
      console.log(`IMDb ID not found for "${title}", using title as key.`);
      return title;
    }
  } catch (error) {
    // In case of an error with the request, log the error and return the title
    console.error(`Error fetching IMDb ID for "${title}":`, error.message);
    return title;
  }
}

// fetchIMDbIDOrTitle('Breaking');


// https.get('https://zaktv.city/get.php?username=temtesfay1055&password=telegram4321&type=m3u_plus&output=ts', res => {
//   let data = [];

//   res.on('data', chunk => {
//     data.push(chunk);
//   });

//   // Assuming 'dataset' is your data object, 'apiKey' is your OMDb API key
// res.on('end', async () => {
//   const playlist = Buffer.concat(data).toString();
//   const result = parser.parse(playlist);
//   const results = result.items;

//   for (const item of results) {
//     if (item.url.includes("movie")) {
//       const title = item.name.slice(0, -7); // Extract title
//       // Fetch IMDb ID or fallback to title
//       // const key = await fetchIMDbIDOrTitle(title);

//       // dataset[key] = {
//       //   name: item.name,
//       //   type: "movie",
//       //   url: item.url
//       // };
//     }
//   }

//   // Log the dataset after it has been fully populated
//   // console.log(dataset);
// });
// })
// .on('error', err => {
//   console.error(err.message);
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");
serveHTTP(addonInterface, { port: 3000 });
