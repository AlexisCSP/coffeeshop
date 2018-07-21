const express = require('express');
const controller = require('../controllers/voteController');

const router = express.Router();

router.post('/new', controller.createNewVote);

module.exports = router;