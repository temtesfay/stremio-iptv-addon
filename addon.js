
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require('axios');
const cinemeta = require("cinemeta.js");
const omdb = new (require('omdbapi'))('1ff254ef');

const iptvPort = 'zaktv.city';
const username = 'temtesfay1055';
const password = 'telegram4321';
const userSelectedLiveTvCategories = [];
const userSelectedVODCategories = [];
const userSelectedSeriesCategories = [];
const getMovie = "&action=get_vod_streams";
const getSeries = '&action=get_series';
const getSeriesEpisode = '&action=get_series_info&series_id='
const apiURL = `https://${iptvPort}/player_api.php?username=${username}&password=${password}`;
const normalURL = `https://${iptvPort}/movie/${username}/${password}`;
const normalURLSeries = `https://${iptvPort}/series/${username}/${password}`;

const express = require('express');
const app = express();

app.get('/configure', function (req, res) {
    res.render('configure.ejs');
  })



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
        "meta",
        "stream"
    ],

    "types": ["movie", "series"], // your add-on will be preferred for these content types

    // set catalogs, we'll have 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [
        {   type: 'movie',
            id: 'StremioIPTV',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                },
              ]
        },
        {
            type: 'series',
            id: 'StremioIPTV',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                },
              ]
        },
        
    ],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt","VOD"]

};

const builder = new addonBuilder(manifest);

builder.defineMetaHandler(function(args) {
    const id = args.id;

    // Check if the ID starts with 'VOD_'
    if (id.startsWith("VOD")) {
        // Look up the metadata in the dataset using the ID
        const meta = dataset[id];
        if (meta) {
            // console.log("Returning meta for:", id, meta.genres);
            // Return the found metadata
            return Promise.resolve({ meta });
        } else {
            console.log("No meta found for:", id);
            // If no metadata found, return an error or empty meta
            return Promise.resolve({ meta: {} });  // or reject(new Error("Meta not found for ID: " + id));
        }

    } else {
        // If the ID does not start with 'VOD_', handle other IDs or reject
        console.log("Unhandled ID prefix for meta:", id);
        return Promise.resolve({ meta: {} });  // or reject(new Error("Unhandled ID prefix"));
    }
});

const dataset = {
    "tt0120737": { name: "The Lord of the Rings: The Fellowship of the Ring", type: "movie", url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1932197.mp4" },
    "VOD_Pulp_Fiction": {
        id:'VOD_Pulp_Fiction',
        name: 'Pulp Fiction',
        type: "movie",
        url: "http://zaktv.city:80/movie/temtesfay1055/telegram4321/1932197.mp4",
        poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        genres: ['Crime', 'Drwama'],
        description: 'A 1994 American neo-noir black comedy crime film directed by Quentin Tarantino.',
        cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
        director: 'Quentin Tarantino',
        background: 'https://images.unsplash.com/photo-1461783470466-185038239ee3',  // Confirm this URL is accessible
        logo: 'https://b.kisscc0.com/20180705/yee/kisscc0-art-forms-in-nature-jellyfish-recapitulation-theor-jellyfish-5b3dcabcb00692.802484341530776252721.png',
        runtime: '154 min'

    },
    "tt0096697:35:1": { name: "The Simpsons", type: "series", url: "http://zaktv.city:80/series/temtesfay1055/telegram4321/2106939.mkv" }, 
    'tt0411008:6:16': {name:'Lost', type:'series',url:'http://zaktv.city:80/series/temtesfay1055/telegram4321/2198493.mkv'},
    'tt0411008:6:17': {name:'Lost', type:'series',url:'http://zaktv.city:80/series/temtesfay1055/telegram4321/2198503.mkv'}
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
                  const poster = result.stream_icon;
                  const genres = result.genre.split(',').map(genre => genre.trim().toLowerCase());
                  const description = result.plot;
                  const cast = result.cast;
                  const director = result.director;
                  const background = '';
                  const logo = '';
                  const runtime = result;
                  try {
                    omdb.search({
                        search: title,  // required
                        type: 'movie',             // optionnal  ['series', 'episode', 'movie']
                        year: result.year,               // optionnal
                        page: '1'                   // optionnal (1 to 100)
                    }).then(res => {
                        // console.log('got response:', res[0]);
                         const showResult = res[0]
                         const imdbID = showResult.imdbid;
                         console.log(imdbID);
                        if (imdbID.startsWith("tt")) {
                         dataset[imdbID] = {
                            name: title,
                            type: "movie", // Assuming type here; adjust as needed
                            url: streamURL // Assuming there's a direct URL for the episode
                        };}
                        else {

                        }
                    }).catch(console.error) 
                  } catch (err) {
                      console.error(`Error fetching IMDb ID for "${title}":`, err.message);
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
            const series_id = result.series_id;
                try {
                    const EpisodeUrl = `${apiURL}${EpisodeInfo}${series_id}`;
                    const episodeResponse = await axios.get(EpisodeUrl);
                    const episodeResults = episodeResponse.data.episodes;
                    // Iterate over each season
                    for (const season in episodeResults) {
                        const episodes = episodeResults[season];
                        // Iterate over each episode in the current season
                        episodes.forEach(episode => {
                          // console.log(imdbID)
                            // console.log(`Season: ${season}, Episode: ${episode.episode_num}, Title: ${episode.title}`);
                            const episodeImdbID = `s${series_id}e${season}${episode.episode_num}`; // This is a placeholder
                            // Update dataset with the obtained IMDb ID or placeholder
                            omdb.search({
                                search: title,  // required
                                type: 'series',             // optionnal  ['series', 'episode', 'movie']
                                year: result.year,               // optionnal
                                page: '1'                   // optionnal (1 to 100)
                            }).then(res => {
                                // console.log('got response:', res[0]);
                                 const showResult = res[0]
                                 console.log(showResult);
                                 const imdbID = showResult.imdbid;
                                if (imdbID.startsWith("tt")) {
                                    dataset[`${imdbID}:${season}:${episode.episode_num}`] = {
                                        name: title,
                                        type: "series",
                                        url: `${normalURLSeries}/${episode.id}.${episode.container_extension}`
                                    };}
                                else {
                                    dataset[`VOD_${title}:${season}:${episode.episode_num}`] = {
                                        name: title,
                                        type: "series",
                                        url: `${normalURLSeries}/${episode.id}.${episode.container_extension}`
                                    };
                                }
                                
                          }).catch(console.error);
                        });
                        continue
                    }
                } 
                catch (err) {
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
    // Detect if the key starts with "VOD" for custom formatting
    if (key.startsWith("VOD")) {
        return {
            id: key,
            type: value.type,
            name: value.name,
            poster: value.poster || 'https://path.to/default/poster.jpg',
            genre: value.genres ? value.genres.join(", ") : "Misc",
            description: value.description || "Custom content from VOD service."
        };
    } else {
        // Standard IMDb ID-based metadata
        const imdbId = key.split(":")[0];
        const METAHUB_URL = "https://images.metahub.space";
       return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL+"/poster/medium/"+imdbId+"/img",
    }
}};


builder.defineCatalogHandler(function(args, cb) {
    // filter the dataset object and only take the requested type
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key))

    return Promise.resolve({ metas: metas })
})


// builder.defineCatalogHandler(function(args) {
//     console.log("Catalog request for:", args.type, "with extra:", args.extra);

//     const metas = Object.entries(dataset)
//         .filter(([_, value]) => value.type === args.type)
//         .map(([key, value]) => generateMetaPreview(value, key));

//     // Implement pagination if needed
//     const from = parseInt(args.extra.skip || 0);
//     const to = from + 30; // Example pagination logic
//     const response = {
//         metas: metas.slice(from, to)
//     };

//     // console.log("Returning catalog items from", from, "to", to, "Total:", metas.length);
//     return Promise.resolve(response);
// });



module.exports = builder.getInterface()
app.listen(80, function() {
    console.log('Running on port 80')
  })