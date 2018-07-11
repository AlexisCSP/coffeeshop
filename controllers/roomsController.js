const models = require('../models');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

let numUsers = 0;

/* Generates Room Keys - hard coded at length 4 */
var keygen = function() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    for (let i = 0; i < 4; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

/* GET index */
exports.index = function(req, res){
  models.Room.findAll().then(rooms => {
    res.render('room_index', { title: 'Room List', rooms: rooms });
  });
};

/* GET create room */
exports.room_create_get = function(req, res){
  res.render('room_form', { title: 'Create Room' });
}

/* POST create room */
exports.room_create_post = [
  body('title', 'Title is required').isLength({ min: 1 }).trim(),
  sanitizeBody('title').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);

    /* There were validation errors */
    if (!errors.isEmpty()) {
      res.render('room_form', { title: 'Create Room', room: room, errors: errors.array()});
      return;
    }
    else {
        do{ var roomKey = keygen(); } 
        while (models.Room.findAndCount({where: {key: roomKey} }).count < 1);
        models.Room.findOrCreate({
            where: {id: req.body.id || 0, key: roomKey},
            defaults: { 
                id:    req.body.id,
                key:   roomKey,
                title: req.body.title,
            }
        })
        .spread(room  => {
            res.redirect('/rooms/'+room.id);
        })
    }
  }
];

/* GET room detail */
exports.room_detail_get = function(req, res){
  models.Room.findById(req.params.id).then(room =>{
    res.io.emit('user joined room', 'test');
    res.render('room_detail', { title: 'Room Information', room: room });
  });
}

/* GET room edit */
exports.room_edit_get = function(req, res){
    res.send('NOT YET IMPLEMENTED');
}

/* POST room edit */
exports.room_edit_post = function (req, res){
    res.send('NOT YET IMPLEMENTED');
}
