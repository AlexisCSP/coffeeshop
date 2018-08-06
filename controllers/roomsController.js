const models = require('../models');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
exports.index = function(req, res) {
  var contype = req.headers['content-type'];
  models.Room.findAll().then(rooms => {
    // React
    if (contype == 'application/json') {
      res.json(rooms)
    // Template
    } else {
      res.render('room_index', { title: 'Room List', rooms: rooms });
    }
  });
}

/* GET create room */
exports.room_create_get = function(req, res){
    console.log(req.cookies.spotify_id);
    if (req.cookies.spotify_id) {
        res.render('room_form', { title: 'Create Room' });
    } else {
        res.redirect("/");
    }
}

/* POST create room */
exports.room_create_post = [
  body('title', 'Title is required').isLength({ min: 1 }).trim(),
  sanitizeBody('title').trim().escape(),
  (req, res) => {
    const contype = req.headers['content-type'];
    const errors = validationResult(req);

    /* There were validation errors */
    if (!errors.isEmpty()) {
      res.json({ title: 'Create Room', room: room, errors: errors.array()});
      return;
    }
    else {
      let roomKey = '';
      do{ roomKey = keygen(); }
      while (models.Room.findAndCount({where: {key: roomKey} }).count < 1);
      console.log(req.cookies.spotify_id);
      models.Room.findOrCreate({
          where: {id: req.body.id || 0, key: roomKey},
          defaults: {
              id:    req.body.id,
              key:   roomKey,
              title: req.body.title,
              owner: req.cookies.spotify_id,
          }
      })
      .spread(room  => {
        // React
        if (contype == 'application/json'){
          res.json(room);
        // Template
        } else {
          res.redirect('/rooms/'+room.id);
        }
      })
    }
  }
];

/* GET room detail */
exports.room_detail_get = function(req, res){
  const contype = req.headers['content-type'];
  const roomID = req.params.id;
  Promise.all([
    models.Room.findById(roomID),
    candidateHelper.getCandidates(roomID)
  ]).then(results => {
    const room = results[0];
    const candidates = results[1];
    // React
    if (contype == 'application/json') {
      res.json({
        room: room,
        candidates: candidates,
        access_token: req.cookies.access_token
      });
    // Template
    } else {
      res.render('room_detail', {
        title: 'Room Information',
        room: room,
        candidates: candidates,
        access_token: req.cookies.access_token
      });
    }
  });
}

/* GET room edit */
exports.room_update_get = function(req, res){
    models.Room.findById(req.params.id).then(function(room) {
        if (req.cookies.spotify_id === room.owner) {
            res.render('room_form', { title: 'Edit Room', room: room });
        }
    }).catch(function (err) {
      return next(err);
    })
}

/* POST room edit */
exports.room_update_post = [
  body('title', 'Title is required').isLength({ min: 1 }).trim(),
  sanitizeBody('title').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    /* There were validation errors */
    if (!errors.isEmpty()) {
      res.render('room_form', { title: 'Create Room', room: req.body, errors: errors.array()});
      return;
    }
    else {
        // load all existing room's Information
        var room = models.Room.findById(req.params.id);
        room['title'] = req.body.title;
        // find and update room
        models.Room.findById(req.params.id).then((instance) => {
          instance.update(room).then((self) => {
            res.redirect('/rooms/' + self.id);
          }).catch(function(err) {
            return next(err);
          })
        });
    }
  }
];

/* GET room delete */
exports.room_delete_get = function(req, res){
    models.Room.findById(req.params.id).then(function(room) {
      res.render('room_form', { title: 'Delete Room', room: room });
    }).catch(function (err) {
      return next(err);
    })
}

/* POST room delete */
exports.room_delete_post = function (req, res){
    models.Room.destroy({
        where: {
            id: req.body.id,
        },
    }).then(function() {
        res.redirect('/rooms/');
    });
}

/* GET room candidates */
exports.room_candidates_get = (req, res) => {
  const roomId = req.params.id;
  candidateHelper.getCandidates(roomId).then(candidates => {
    res.json(candidates)
  });
}

/* POST room dequeue, which removes the song at the top of the queue */
exports.room_dequeue_post = (req, res) => {
  const roomId = req.params.id;
  candidateHelper.getCandidates(roomId).then(candidates => {
    if (candidates.length > 0) {
      candidates[0].destroy().then(() => {
        console.log("Song Dequeued")
        res.json("result");
      });
    }
  });
}


/* get a suggested song list from the database for new created room */
// Option1: get songs based on the votes through all rooms
exports.room_candidate_suggestion_get = function(req, res, next) {
    models.Candidate.findAll({
      attributes: ['songId', [Sequelize.fn('sum', Sequelize.col('vote_count')), 'total_vote']
      ],
      group: ['songId'],
      order: [[Sequelize.fn('sum', Sequelize.col('vote_count')), 'DESC']],
      limit: 10, // top ten songs with highest #vote_count
      raw: true,
  }).then((candidates) => {
      console.log(candidates);
      var songIdArray = candidates.map(function(el) { return el.songId; })
      models.Song.findAll({
          where: {
              id: {
                  [Op.or]: songIdArray
              }
          }
      }).then((songs) => {
          res.render('room_song_suggestion', { title: 'Suggestion', song_list: songs });
      })
  })
}
