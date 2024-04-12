const axios = require('axios');
const nameToImdb = require("name-to-imdb");
const { promisify } = require('util');

const nameToImdbAsync = promisify(nameToImdb);

const getMovie = "&action=get_vod_streams";
const getSeries = '&action=get_series';
const getSeriesEpisode = '&action=get_series_info&series_id='
const apiURL = "https://zaktv.city/player_api.php?username=temtesfay1055&password=telegram4321";
const normalURL = 'http://zaktv.city:80/movie/temtesfay1055/telegram4321';
const normalURLSeries = 'http://zaktv.city:80/series/temtesfay1055/telegram4321'

const dataset = {};

async function fetchMovie(endpoint) {
    try {
        const url = `${apiURL}${endpoint}`;
        const response = await axios.get(url);
        const results = response.data;
        
        if (results) {
            for (const result of results) {
                //    console.log(result)
                // if (result.genre == 'Comedy') { // Assuming you want to process all titles, not just 'Pulp Fiction'
                    const title = result.title;
                    console.log(result)
                    const streamID = result.stream_id;
                    const containerExtension = result.container_extension;
                    const streamURL = `${normalURL}/${streamID}.${containerExtension}`;

                    try {
                        // Use the promisified nameToImdb function
                        const imdbID = await nameToImdbAsync(title);
                        // Update dataset with the obtained IMDb ID or title
                        dataset[imdbID] = {
                            name: title,
                            type: "movie", // Assuming type here; adjust as needed
                            url: streamURL
                        };

                       
                    } catch (err) {
                        console.error(`Error fetching IMDb ID for "${title}":`, err.message);
                        // Fallback to using title if IMDb ID fetch fails
                        dataset[title] = {
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
            const series_id = result.series_id;
            
            if (title === 'The Big Bang Theory') { // Specific title check
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
                            console.log(`Season: ${season}, Episode: ${episode.episode_num}, Title: ${episode.title}`);
                            // Assuming each episode object has an episode number and title

                            // You might need to generate or have an IMDb ID for each episode here
                            // For demonstration, we'll use a combination of series_id, season, and episode number
                            const episodeImdbID = `s${series_id}e${season}${episode.episode_num}`; // This is a placeholder

                            // Update dataset with the obtained IMDb ID or placeholder
                            dataset[`${imdbID}:${season}:${episode.episode_num}`] = {
                                name: `${title}`,
                                type: "series", // Assuming type here; adjust as needed
                                url: `${normalURLSeries}/${episode.id}.${episode.container_extension}` // Assuming there's a direct URL for the episode
                            };
                        });
                    }

                } catch (err) {
                    console.error(`Error processing episode for "${title}":`, err.message);
                }
            }
        }
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



