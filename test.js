const axios = require('axios');
const nameToImdb = require("name-to-imdb");

nameToImdb("Poor Things", function(err, res, inf) { 
    console.log(res); // "tt0121955"
    // inf contains info on where we matched that name - e.g. metadata, or on imdb
    // and the meta object with all the available data
    console.log(inf);
  })



