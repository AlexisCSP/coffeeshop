var express = require('express');
var router = express.Router();

const spotify_controller = require('../controllers/spotifyController');

/* Authorize through spotify */
router.get('/login', spotify_controller.login);

router.get('/callback', spotify_controller.callback);

router.get('/refresh_token', spotify_controller.refresh_token);

router.get('/search', spotify_controller.search_get);

router.post('/search', spotify_controller.search_post);

module.exports = router;
