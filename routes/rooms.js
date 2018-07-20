var express = require('express');
var router = express.Router();

const rooms_controller = require('../controllers/roomsController');
const candidates_router = require('./candidates');

router.get('/', rooms_controller.index);

router.get('/create', rooms_controller.room_create_get);

router.post('/create', rooms_controller.room_create_post);

router.get('/:id', rooms_controller.room_detail_get);

router.get('/:id/update', rooms_controller.room_update_get);

router.post('/:id/update', rooms_controller.room_update_post);

router.get('/:id/delete', rooms_controller.room_delete_get);

router.post('/:id/delete', rooms_controller.room_delete_post);

module.exports = router;
