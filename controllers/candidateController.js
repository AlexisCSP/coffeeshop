const { body, query, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const numberUtility = require('../utilities/numberUtitlity');

exports.createNewCandidate = [
    body('SongId', 'Song Id is required'),
    sanitizeBody('SongId'),

    body('RoomId', 'Room Id is required').isNumeric(),
    sanitizeBody('RoomId').toInt(),

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

    body('UserId', 'User ID is required (May be null)').exists(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // TODO: Handle this properly
            return;
        }

        var userId = req.body.UserId;

        if (userId && userId != null && userId != ""){
            userId = parseInt(userId);
        } else {
            userId = null;
        }

        var data = {
            name: req.body.name,
            artist: req.body.artist,
            songId: req.body.SongId,
            preview: req.body.preview,
            album_name: req.body.album_name,
            album_image: req.body.album_image,
            vote_count: 1,
            userId: userId,
            roomId: req.body.RoomId
        };
        candidateHelper.createNewCandidate(data)
            .then( () => {
                res.redirect(`/rooms/${roomId}`);
            }
        );
    }
];

exports.upvoteCandidate = [
  body('SongId', 'Song Id is required'),
  sanitizeBody('SongId'),

  body('RoomId', 'Room Id is required').isNumeric(),
  sanitizeBody('RoomId').toInt(),

  (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          // TODO: Handle this properly
          return;
      }

      const roomId = req.body.RoomId;
      const songId = req.body.SongId;
      var userId = req.body.UserId;

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
  body('SongId', 'Song Id is required'),
  sanitizeBody('SongId'),

  body('RoomId', 'Room Id is required').isNumeric(),
  sanitizeBody('RoomId').toInt(),

  (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          // TODO: Handle this properly
          return;
      }

      const roomId = req.body.RoomId;
      const songId = req.body.SongId;
      var userId = req.body.UserId;

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
