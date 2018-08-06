const { body, query, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const numberUtility = require('../utilities/numberUtitlity');

const models = require('../models');

exports.createNewCandidate = [
    body('uri', 'uri is required'),
    sanitizeBody('uri'),

    body('roomId', 'room Id is required').isNumeric(),
    sanitizeBody('roomId').toInt(),

    body('name', 'name is required'),
    sanitizeBody('name'),

    body('artist', 'artist is required'),
    sanitizeBody('artist'),

    body('preview', 'preview is required'),
    sanitizeBody('preview'),

    body('album_name', 'album_name is required'),
    sanitizeBody('album_name'),

    body('album_image', 'album_image is required'),
    sanitizeBody('album_image'),

    body('userId', 'user ID is required (May be null)').exists(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // TODO: Handle this properly
            return;
        }

        var userId = req.body.userId;

        if (userId && userId != null && userId != ""){
            userId = parseInt(userId);
        } else {
            userId = null;
        }

        var data = {
            name: req.body.name,
            artist: req.body.artist,
            duration_ms: req.body.duration_ms,
            uri: req.body.uri,
            preview: req.body.preview,
            album_name: req.body.album_name,
            album_image: req.body.album_image,
            vote_count: 1,
            userId: userId,
            roomId: req.body.roomId
        };
        candidateHelper.createNewCandidate(data)
            .then( () => {
                res.redirect(`/rooms/${req.body.roomId}`);
            }
        );
    }
];

exports.upvoteCandidate = [
  body('songId', 'song Id is required'),
  sanitizeBody('songId'),

  body('roomId', 'room Id is required').isNumeric(),
  sanitizeBody('roomId').toInt(),

  (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          // TODO: Handle this properly
          return;
      }

      const roomId = req.body.roomId;
      const songId = req.body.songId;
      var userId = req.body.userId;

      if (userId && userId != null && userId != ""){
          userId = parseInt(userId);
      } else {
          userId = null;
      }

      candidateHelper.commit_vote(roomId, songId, userId, "upvote")
          .then( (candidate) => {
            res.json(candidate)
          }
      );
  }
];

exports.downvoteCandidate = [
  body('songId', 'song Id is required'),
  sanitizeBody('songId'),

  body('roomId', 'room Id is required').isNumeric(),
  sanitizeBody('roomId').toInt(),

  (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          // TODO: Handle this properly
          return;
      }

      const roomId = req.body.roomId;
      const songId = req.body.songId;
      var userId = req.body.userId;

      if (userId && userId != null && userId != ""){
          userId = parseInt(userId);
      } else {
          userId = null;
      }

      candidateHelper.commit_vote(roomId, songId, userId, "downvote")
          .then( (candidate) => {
            res.json(candidate)
          }
      );
  }
];

// Display Contact create form on POST.
exports.candidate_create_post = function(candidate) {

    var data = {
        uri: candidate.uri,
        name: candidate.song,
        artist: candidate.artist,
        album_name: candidate.album_name,
        album_image: candidate.album_image,
        room: candidate.room
    };

    // find or create a new song
    models.Song.findOrCreate({
        where: { uri: candidate.uri },
        defaults: data
    }).spread((song, created) => {
        models.Candidate.findOrCreate( {
            where: { roomId: candidate.room, songId: song.get({ plain: true}).id }, defaults: { vote_count: candidate.votes }
        }).spread((newCandidate, created) => {
            // if candidate exists
            if (created === false) {
                // update total vote_count
                new_vote_count  = newCandidate.vote_count + candidate.votes;
                newCandidate.update({
                    vote_count: new_vote_count
                });
            }
        })
    })
};
