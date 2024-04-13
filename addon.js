
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require('axios');
const https = require('https');
const parser = require('iptv-playlist-parser');
const nameToImdb = require("name-to-imdb");
const { promisify } = require('util');


const nameToImdbAsync = promisify(nameToImdb);
const cinemeta = require("cinemeta.js");
const omdb = new (require('omdbapi'))('1ff254ef');

const getMovie = "&action=get_vod_streams";
const getSeries = '&action=get_series';
const getSeriesEpisode = '&action=get_series_info&series_id='
const apiURL = "https://zaktv.city/player_api.php?username=temtesfay1055&password=telegram4321";
const normalURL = 'http://zaktv.city:80/movie/temtesfay1055/telegram4321';
const normalURLSeries = 'http://zaktv.city:80/series/temtesfay1055/telegram4321'
const userSelectedLiveTvCategories = [];
const userSelectedVODCategories = [];
const userSelectedSeriesCategories = [];


const manifest = {
    "id": "org.stremio.stremioiptv",
    "version": "1.0.0",

    "name": "StremioIPTV",
    "description": "Integrate VOD content/streams from your IPTV service into Stremio's popular catalogs.",

    "icon": "https://linuxmasterclub.com/wp-content/uploads/2020/06/Stremio-logo.png", 
    "background": "URL to 1024x786 png/jpg background",

    // set what type of resources we will return
    "resources": [
        "catalog",
        // "meta",
        "stream"
    ],

    "types": ["movie", "series"], // your add-on will be preferred for these content types

    // set catalogs, we'll have 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [
        {
            type: 'livetv',
            id: 'LiveTVCatalog',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                }
              ]
        },
        {
            type: 'movie',
            id: 'MovieCatalog',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                },
                // { "name": "search", "isRequired": false },
              ]
        },
        {
            type: 'series',
            id: 'SeriesCatalog',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                },
                // { "name": "search", "isRequired": false },
              ]
        },
        
    ],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt", "channel:"]

};

const builder = new addonBuilder(manifest);

const dataset = {
    // Some examples of streams we can serve back to Stremio ; see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/stream.md
    // "tt0051744": { name: "House on Haunted Hill", type: "movie", infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960" }, // torrent
    // "tt1254207": { name: "Big Buck Bunny", type: "movie", url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" }, // HTTP stream
    // "tt0031051": { name: "The Arizone Kid", type: "movie", ytId: "m3BKVSpP80s" }, // YouTube stream
    // "tt0137523": { name: "Fight Club", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1927002.mkv" }, // redirects to Netflix
    "tt0120737": { name: "The Lord of the Rings: The Fellowship of the Ring", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1932197.mp4" }, // redirects to Netflix
    "tt0096697:35:1": { name: "The Simpsons", type: "series", url: "http://zaktv.city:80/series/temtesfay1055/telegram4321/2106939.mkv" }, 
    'tt0411008:6:16': {name:'Lost', type:'series',url:'http://zaktv.city:80/series/temtesfay1055/telegram4321/2198493.mkv'},
    'tt0411008:6:17': {name:'Lost', type:'series',url:'http://zaktv.city:80/series/temtesfay1055/telegram4321/2198503.mkv'},
    'channel:1':{name: 'Sky Sports Main Event UHD', type:'LiveTV', url:'http://zaktv.city:80/temtesfay1055/telegram4321/1836073.m3u8'} 
    
};

async function fetchMovie(endpoint) {
  try {
      const url = `${apiURL}${endpoint}`;
      const response = await axios.get(url);
      const results = response.data;
      
      if (results) {
          for (const result of results) {
              // if (result.genre == 'Comedy') { // Assuming you want to process all titles, not just 'Pulp Fiction'
                  const title = result.title;
                  const streamID = result.stream_id;
                  const containerExtension = result.container_extension;
                  const streamURL = `${normalURL}/${streamID}.${containerExtension}`;

                  try {
                      // Use the promisified nameToImdb function
                      const imdbID = await nameToImdbAsync(title);
                      // Update dataset with the obtained IMDb ID or title

                      cinemeta.searchMovie(title).then(got =>{
                        got.forEach(movie=> {
                            if (movie.name === title && movie.year.substring(0,4) == result.year) {
                                // console.log(movie.name, movie.year)
                                dataset[movie.imdb_id] = {
                                    name: title,
                                    type: "movie", // Assuming type here; adjust as needed
                                    url: streamURL
                                };
                            }
                            
                        });
                    })


                    //   dataset[imdbID] = {
                    //       name: title,
                    //       type: "movie", // Assuming type here; adjust as needed
                    //       url: streamURL
                    //   };
                  } catch (err) {
                      console.error(`Error fetching IMDb ID for "${title}":`, err.message);
                      // Fallback to using title if IMDb ID fetch fails
                      dataset[`${title}`] = {
                          name: title,
                          type: "movie",
                          url: streamURL
                      };
                  }
              }
          }
  } catch (error) {
      console.error(`Failed to fetch movies: ${error.message}`);
  }
}

async function fetchShow(showInfo, EpisodeInfo) {
  try {
      const ShowUrl = `${apiURL}${showInfo}`;
      const response = await axios.get(ShowUrl);
      const showResults = response.data;
      
      for (const result of showResults) {
          const title = result.title;
        //   console.log(title)
          const series_id = result.series_id;
          
        //   if (title) { // Specific title check
              try {
                  const imdbID = await nameToImdbAsync(title);
                  const EpisodeUrl = `${apiURL}${EpisodeInfo}${series_id}`;
                  const episodeResponse = await axios.get(EpisodeUrl);
                  const episodeResults = episodeResponse.data.episodes;
                  // console.log(episodeResults);

                  // Iterate over each season
                  for (const season in episodeResults) {
                      const episodes = episodeResults[season];
                      // Iterate over each episode in the current season
                      episodes.forEach(episode => {
                        // console.log(imdbID)
                          // console.log(`Season: ${season}, Episode: ${episode.episode_num}, Title: ${episode.title}`);
                          const episodeImdbID = `s${series_id}e${season}${episode.episode_num}`; // This is a placeholder
                          console.log(imdbID)
                          // Update dataset with the obtained IMDb ID or placeholder
                          omdb.search({
                            search: title,  // required
                            type: 'series',             // optionnal  ['series', 'episode', 'movie']
                            year: result.year,               // optionnal
                            page: '1'                   // optionnal (1 to 100)
                        }).then(res => {
                            // console.log('got response:', res[0]);
                             const showResult = res[0]
                             const showIMDB = showResult.imdbid;
                             dataset[`${showIMDB}:${season}:${episode.episode_num}`] = {
                                name: `${title}`,
                                type: "series", // Assuming type here; adjust as needed
                                url: `${normalURLSeries}/${episode.id}.${episode.container_extension}` // Assuming there's a direct URL for the episode
                            };

                        }).catch(console.error);
                        console.log(title)
                      });
                  }

              } catch (err) {
                  console.error(`Error processing episode for "${title}":`, err.message);
              }
          }
    //   } if statement closing parenthesis
  } catch (error) {
      console.error(`Failed to fetch shows: ${error.message}`);
  }
}

fetchMovie(getMovie).then(() => {
  console.log("Dataset updated:", dataset);
});

fetchShow(getSeries,getSeriesEpisode).then(() => {
  console.log("Dataset updated:", dataset);
});


// Streams handler
builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

const METAHUB_URL = "https://images.metahub.space"

const generateMetaPreview = function(value, key) {
    // To provide basic meta for our movies for the catalog
    // we'll fetch the poster from Stremio's MetaHub
    // see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/meta.md#meta-preview-object
    const imdbId = key.split(":")[0]
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL+"/poster/medium/"+imdbId+"/img",
    }
}

builder.defineCatalogHandler(function(args, cb) {
    // filter the dataset object and only take the requested type
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key))

    return Promise.resolve({ metas: metas })
})



module.exports = builder.getInterface()