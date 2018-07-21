const express = require('express');
const controller= require('../controllers/candidateController')

const router = express.Router();

router.post('/new', controller.createNewCandidate);

module.exports = router;