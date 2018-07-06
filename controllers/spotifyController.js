const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Import the Spotify API
var Spotify = require('node-spotify-api');

//Import our Keys File
var keys = require('../routes/keys');

//Create a Spotify Client
var spotify = new Spotify(keys.spotifyKeys);

//Store the results of a request to spotify
var results = [];

exports.search_get = function (req, res, next) {
    res.render('index', {title: 'Coffeeshop', results: results});
};

exports.search_post = function (req, res, next) {
    //Get the type of Query from the User
    var type = 'track';

    //Get the query from the user
    var query = req.body.query;

    //Clear out old results
    results = [];

    //Make a request to Spotify
    spotify.search({type: type, query: query})
        .then(function (spotRes) {

            //Store the artist, song, preview link, and album in the results array
            spotRes.tracks.items.forEach(function(ea){
                results.push({artist: ea.artists[0].name,
                              song: ea.name,
                              preview: ea.external_urls.spotify,
                              album: ea.album.name});
            });
            console.log(results);
            //Render the homepage and return results to the view
            res.render('index', {title: 'Coffeeshop', results: results});
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        });
};
