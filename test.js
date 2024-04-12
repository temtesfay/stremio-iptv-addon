const axios = require('axios');
const nameToImdb = require("name-to-imdb");

const cinemeta = require("cinemeta.js");

const oldMovie = 'Road House (4k)';
const oldMovieYear = '1980';

const newMovie = 'Road House'
const newMovieYear = '2024'


cinemeta.searchMovie('Road House').then(got =>{
    got.forEach(movie=> {
        // console.log(movie)
        if (oldMovie.includes(movie.name) && movie.year.substring(0,4) == oldMovieYear) {
            console.log(movie)
        }
        
    });
})

// cinemeta.searchOTBOYear("2023").then(data =>{
//     console.log(data)
// })

// cinemeta.searchSeries("The Bear").then(got =>{
//     console.log(got)
// })

