var express = require('express');
var router = express.Router();

var room_controller = require('../controllers/roomController');
var spotify_controller = require('../controllers/spotifyController');

/* GET home page. */
router.get('/', room_controller.index);



module.exports = router;
