/* Based off https://github.com/spotify/web-api-auth-examples */
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const request = require('request');
const querystring = require('querystring');
const Spotify = require('node-spotify-api');
const keys = require('../routes/keys');

/* API Credentials */
var client_id = 'c086167c88da4af6a09abe8244133a5b';
var client_secret = 'ebb82a0aa5334a51bfbe31d9f2e596d6';
var redirect_uri = 'http://localhost:3001/spotify/callback';
var stateKey = 'spotify_auth_state'; //response header

/* Helper for statekey generation */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.login = function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // application requests authorization
    // TODO Make scope multi-line for easier reading
    var scope = 'streaming user-read-birthdate user-read-private user-read-email playlist-read-private user-library-read user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
};

exports.callback = function(req, res) {
    // application requests refresh and access tokens
    // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }));
    }
    else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                console.log(body);
            });

            res.cookie('access_token', access_token);
            res.cookie('refresh_token', refresh_token);
            // we can also pass the token to the browser to make requests from there
            // res.redirect('/#' +
            // querystring.stringify({
            //     access_token: access_token,
            //     refresh_token: refresh_token
            // }));

            // Enable for React redirect
            res.redirect('http://localhost:3000');

            // Enable for Pug redirect
            //res.redirect('http://localhost:3001');
        }
        else {
            res.redirect('/#' +
            querystring.stringify({
                error: 'invalid_token'
            }));
        }
        });
    }
};

exports.refresh_token = function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
            'access_token': access_token
        });
        }
    });
};

//Create a Spotify Client
var spotify = new Spotify(keys.spotifyKeys);

//Store the results of a request to spotify
var results = [];

exports.spotify_search_get = function (req, res, next) {
    var contype = req.headers['content-type'];

    // Get the type of Query from the User
    var type = 'track';

    // Get the query from the user
    var query = req.params.query;

    // Clear out old results
    results = [];

    // Make a request to Spotify
    spotify
        .search({type: type, query: query})
        .then( (spotify_res) => {
            // Store the artist, song, preview link, and album in the results array
            spotify_res.tracks.items.forEach(function(obj){
                results.push({artist: obj.artists[0].name,
                              song: obj.name,
                              uri: obj.uri,
                              url: obj.external_urls.spotify,
                              id: obj.id,
                              preview: obj.preview,
                              album_name: obj.album.name,
                              album_image: obj.album.images[0].url
                            });
            });
            if (contype == 'application/json') {
                res.json(results);
            } else {
                res.render('search', { title: 'Search results', results: results });
            }
        })
        .catch(function (err) {
            console.log(err);
            throw err;
        });
};
