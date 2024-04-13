const axios = require('axios');
const nameToImdb = require("name-to-imdb");

const cinemeta = require("cinemeta.js");
const omdb = new (require('omdbapi'))('1ff254ef');

const oldMovie = 'The Office';
const oldMovieYear = '2001';

const newMovie = 'Road House'
const newMovieYear = '2024'



omdb.search({
    search: 'Shogun',  // required
    type: 'series',             // optionnal  ['series', 'episode', 'movie']
    year: '1978',               // optionnal
    page: '1'                   // optionnal (1 to 100)
}).then(res => {
    console.log('got response:', res[0]);
}).catch(console.error);

// omdb.get({
//     id: 'tt0944947',            // optionnal (requires imdbid or title)
//     title: 'Game of Thrones',   // optionnal (requires imdbid or title)
//     season: 1,                  // optionnal
//     episode: 1,                 // optionnal
//     type: 'series',             // optionnal ['series', 'episode', 'movie']
//     plot: 'full',               // optionnal (defaults to 'short')
//     tomatoes: true,             // optionnal (get rotten tomatoes ratings)
//     year: '2011'                // optionnal
// }).then(res => {
//     console.log('got response:', res);
// }).catch(console.error);













// cinemeta.searchSeries(oldMovie).then(got =>{
//     got.forEach(show=> {
//         if (show.year.substring(0,4) == oldMovieYear) {
//              console.log(show.name, show.year)
//             // dataset[movie.imdb_id] = {
//             //     name: title,
//             //     type: "movie", // Assuming type here; adjust as needed
//             //     url: streamURL
//             // };
//         }
//     });
// })

// cinemeta.searchSeries(oldMovie).then(got =>{
//     console.log(got)
// })