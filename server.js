const express = require('express');
const https = require('https');
const parser = require('iptv-playlist-parser');
const axios = require('axios');
const app = express();
const port = 9000;

async function fetchIMDbID(query) {
  try {
    const response = await axios.get(`https://www.omdbapi.com/?t=${query}&apikey=f2ff5bca`);
    // Consider handling the case where imdbID is not present
    return response.data.imdbID || 'unknown'; // More consistent handling of missing imdbID
  } catch (error) {
    console.error(error);
    return 'unknown';
  }
}
async function logIMDbID() {
  try {
    const imdbID = await fetchIMDbID('Breaking Basdfsdfsdfd');
    console.log(imdbID); // This will log the actual IMDb ID once the promise resolves
  } catch (error) {
    console.error('Failed to fetch IMDb ID:', error);
  }
}

// logIMDbID(); // Call the async function




const dataset = {
  // Some examples of streams we can serve back to Stremio ; see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/stream.md
  "tt0051744": { name: "House on Haunted Hill", type: "movie", infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960" }, // torrent
  "tt1254207": { name: "Big Buck Bunny", type: "movie", url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" }, // HTTP stream
  "tt0031051": { name: "The Arizone Kid", type: "movie", ytId: "m3BKVSpP80s" }, // YouTube stream
  "tt0137523": { name: "Fight Club", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1927002.mkv" }, // redirects to Netflix
  "tt0120737": { name: "The Lord of the Rings: The Fellowship of the Ring", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1932197.mp4" }, // redirects to Netflix
  "tt0096697:35:1": { name: "The Simpsons", type: "series", url: "http://zaktv.city:80/series/temtesfay1055/telegram4321/2106939.mkv" }, 
};


const m3uPlaylist = 'http://zaktv.city:80/get.php?username=temtesfay1055&password=telegram4321&type=m3u&output=ts';
https
  .get('https://zaktv.city/get.php?username=temtesfay1055&password=telegram4321&type=m3u_plus&output=ts', res => {
    let data = []

    res.on('data', chunk => {
      data.push(chunk)
    })

    res.on('end', () => {
      const playlist = Buffer.concat(data).toString()
      const result = parser.parse(playlist)
      const results = result.items
      results.forEach(result => {
        if (result.url.includes("movie")) {   
          const title = result.name.slice(0, -7);
          // fetchIMDbID(title).then(imdbID => {
          //   console.log(title, imdbID, result.url); // This will log the title, IMDb ID, and URL
          // }).catch(error => {
          //   console.error('Failed to fetch IMDb ID:', error);
          // });

                // dataset[imdbID] = {
                //   name: result.name,
                //   type: "movie",
                //   url: result.url
                // };  
        }
      });
    })
  })
  .on('error', err => {
    console.error(err.message)
  })


// console.log(dataset)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

const { serveHTTP } = require("stremio-addon-sdk");

const addonInterface = require("./addon");
serveHTTP(addonInterface, { port: 3000 });
