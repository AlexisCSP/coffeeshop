var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
<<<<<<< HEAD
  res.redirect('/coffeeshop');
=======
  res.render('index', { title: 'Coffee Shop' });
>>>>>>> b78f10573f8f525c1705475332db4efbdf3cb8e2
});

module.exports = router;
