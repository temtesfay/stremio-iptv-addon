const axios = require('axios');
// const nameToImdb = require("name-to-imdb");

const cinemeta = require("cinemeta.js");
const { error } = require('console');
const omdb = new (require('omdbapi'))('1ff254ef');

const oldMovie = 'The Office';
const oldMovieYear = '2001';

const newMovie = 'Road House'
const newMovieYear = '2024'



omdb.search({
    search: 'Ocean Girl',  // required
    type: 'series',             // optionnal  ['series', 'episode', 'movie']
    year: '1994',               // optionnal
    page: '1'                   // optionnal (1 to 100)
}).then(res => {
    console.log('got response:',res);
    
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











