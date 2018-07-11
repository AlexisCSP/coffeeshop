var express = require('express');
var router = express.Router();

var room_controller = require('../controllers/roomController');
var spotify_controller = require('../controllers/spotifyController');

/* GET home page. */
router.get('/', spotify_controller.search_get);
// router.get('/', room_controller.index);

router.post('/', spotify_controller.search_post);

module.exports = router;
