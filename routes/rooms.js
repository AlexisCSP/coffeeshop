var express = require('express');
var router = express.Router();

const rooms_controller = require('../controllers/roomsController');
const candidates_controller = require('../controllers/candidateController');

router.get('/', rooms_controller.index);

router.get('/create', rooms_controller.room_create_get);

router.post('/create', rooms_controller.room_create_post);

router.get('/:id', rooms_controller.room_detail_get);

router.get('/:id/update', rooms_controller.room_update_get);

router.post('/:id/update', rooms_controller.room_update_post);

router.get('/:id/delete', rooms_controller.room_delete_get);

router.post('/:id/delete', rooms_controller.room_delete_post);

router.get('/:id/candidates', rooms_controller.room_candidates_get);

router.post('/:id/dequeue', rooms_controller.room_dequeue_post);

router.post('/:id/candidate/save', candidates_controller.candidate_create_post);

// ajax call to return list of suggested songs
router.get('/:id/suggestion', rooms_controller.room_candidate_suggestion_get);

module.exports = router;
