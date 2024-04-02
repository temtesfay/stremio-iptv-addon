const express = require('express');
const https = require('https');
const parser = require('iptv-playlist-parser');

const app = express();
const port = 3000;


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
      const movies = '';
      const shows = '';
      const title = ''
      const results = result.items
    //   console.log(results)
      results.forEach(result => {
        // console.log(result.group.title)
        if (result.group.title == 'Comedy') {   
            console.log(result.name, result.url)   
        }
      });
    })
  })
  .on('error', err => {
    console.error(err.message)
  })


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

const { serveHTTP } = require("stremio-addon-sdk");

const addonInterface = require("./addon");
serveHTTP(addonInterface, { port: 4000 });
