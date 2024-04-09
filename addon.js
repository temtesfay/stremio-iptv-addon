
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require('axios');
const https = require('https');
const parser = require('iptv-playlist-parser');

const manifest = {
    "id": "org.stremio.stremioiptv",
    "version": "1.0.0",

    "name": "StremioIPTV",
    "description": "Integrate VOD content/streams from your IPTV service into Stremio's popular catalogs.",

    "icon": "URL to 256x500 monochrome png icon", 
    "background": "URL to 1024x786 png/jpg background",

    // set what type of resources we will return
    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"], // your add-on will be preferred for these content types

    // set catalogs, we'll have 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [
        {
            type: 'movie',
            id: 'StremioIPTV',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                },
                // {
                //     "name": "genre",
                //     "options": [ "Drama", "Action","Comedy","Adventure","Animation","Biography","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western", ],
                //     "isRequired": false
                //   }
              ]
        },
        {
            type: 'series',
            id: 'StremioIPTV',
            "extra": [
                {
                  "name": "skip",
                  "isRequired": false
                }
              ]
        },
        // {
        //     type: 'comedy',
        //     id: 'StremioIPTV',
        //     "extra": [
        //         {
        //           "name": "skip",
        //           "isRequired": false
        //         }
        //       ]
        // },
    ],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt" ]

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
    
};

async function fetchIMDbIDOrTitle(title) {
    try {
      const query = encodeURIComponent(title);
      const url = `https://www.omdbapi.com/?t=${query}&apikey=1ff254ef`;
      const response = await axios.get(url);
    //   console.log(query)
  
      if (response.data && response.data.Response === "True") {
        // If the IMDb ID is found, return it
        // console.log(response.data.imdbID)
        return response.data.imdbID;
      } else {
        // If not found, return the original title
        // console.log(`IMDb ID not found for "${title}", using title as key.`);
        return title;
      }
    } catch (error) {
      // In case of an error with the request, log the error and return the title
    //   console.error(`Error fetching IMDb ID for "${title}":`, error.message);
      return title;
    }
  }

async function fetchIMDbEpisode(title,season,episode) {
    try {
      const query = title;
      const query2 = season;
      const query3 = episode;

      const url = `https://www.omdbapi.com/?t=${query}&${query2}&${query3}&apikey=1ff254ef`;
      const response = await axios.get(url);
      console.log(url)
  
      if (response.data && response.data.Response === "True") {
        // If the IMDb ID is found, return it
        console.log(response.data.Season)
        var showID = response.data.seriesID
        var season = response.data.Season
        var episode = response.data.Episode
        var episodeInfo = `${showID}:${season}:${episode}`
        // console.log(episodeInfo)
        return episodeInfo;

      } else {
        // If not found, return the original title
        // console.log(`IMDb ID not found for "${title}", using title as key.`);
        console.log(title)
        return title;
      }
    } catch (error) {
      // In case of an error with the request, log the error and return the title
    //   console.error(`Error fetching IMDb ID for "${title}":`, error.message);
      return title;
    }
  }
// fetchIMDbEpisode('South-Park','Season=1','Episode=1')
// https://www.omdbapi.com/?t=Game%20of%20Thrones&Season=01&Episode=01&apikey=1ff254ef
// https://www.omdbapi.com/?t=Game%20of%20Thrones&Season%3D1&Episode%3D1&apikey=1ff254ef

// fetchIMDbIDOrTitle('Eating Raoul');

https.get('https://zaktv.city/get.php?username=temtesfay1055&password=telegram4321&type=m3u_plus&output=ts', res => {
  let data = [];

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', async () => {
    approvedGroups = ['Comedy','Action','Animation','Adventure','Action & Adventure']
    const playlist = Buffer.concat(data).toString();
    const result = parser.parse(playlist);
    const results = result.items;  
    for (const item of results) {
      if (item.url.includes("movie") && item.group.title == 'Comedy') {
        const title = item.name.slice(0, -7); // Extract title
        // console.log(title)
        // Fetch IMDb ID or fallback to title
        const key = await fetchIMDbIDOrTitle(title);
        dataset[key] = {
          name: title,
          type: "movie",
          url: item.url
        };
      }
      if (item.url.includes("series")) {
        // console.log(title)

        const episodeInfo = item.name.slice(-7)
        const title = item.name.slice(0, -7); // Extract title
        const newTitle = title.replaceAll(' ', '-')

        const season = episodeInfo.slice(1,2) + 'eason=' + episodeInfo.slice(2,4)
        const episode = episodeInfo.slice(4,5) + 'pisode=' + episodeInfo.slice(5,7)


        // console.log(newTitle)
        // Fetch IMDb ID or fallback to title

        const key = await fetchIMDbEpisode(newTitle,season,episode);
        dataset[key] = {
          name: title,
          type: "series",
          url: item.url
        };
      }
    }
  
    // Log the dataset after it has been fully populated
    console.log(dataset);
  });
})
.on('error', err => {
  console.error(err.message);
});


// Streams handler
builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [dataset[args.id]] });
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