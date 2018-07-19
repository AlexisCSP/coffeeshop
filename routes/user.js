const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/new', controller.getNewUserForm);

router.post('/new', controller.createNewUser);

router.get('/', controller.getUserListView);

module.exports = router;