var express = require('express');
var router = express.Router();

const rooms_controller = require('../controllers/roomsController');

router.get('/', rooms_controller.index);

router.get('/create', rooms_controller.room_create_get);

router.post('/create', rooms_controller.room_create_post);

router.get('/:id', rooms_controller.room_detail_get);

module.exports = router;