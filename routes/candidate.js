const express = require('express');
const controller= require('../controllers/candidateController')

const router = express.Router();

router.post('/new', controller.createNewCandidate);

router.post('/upvote', controller.upvoteCandidate);

router.post('/downvote', controller.downvoteCandidate);

module.exports = router;