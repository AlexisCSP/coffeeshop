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
    // From Adam: Structure of candidate object
    console.log('request '+JSON.stringify(candidate));

    // From Adam: Don't need this anymore because we have the object
    // var data = {
    //     id: candidate.id,
    //     uri: candidate.uri,
    //     song: candidate.song,
    //     artist: candidate.artist,
    //     album_name: candidate.album_name,
    //     album_image: candidate.album_image,
    //     votes: candidate.votes,
    //     room: candidate.room
    // };

    console.log(req.body.uri);
    // find or create a new song
    // From Adam: Make sure this actually does what it's supposed to now that value names are different
    models.Song.findOrCreate({
        where: { id: candidate.id },
        defaults: candidate
    }).spread((song, created) => {
        models.Candidate.findOrCreate( {
            where: { roomId: candidate.room, songId: song.get({ plain: true}).id }, defaults: { vote_count: candidate.votes }
        }).spread((candidate, created) => {
            // if candidate exists
            if (created === false) {
                // update total vote_count
                // From Adam: Don't use eval here, not sure what you're trying to do but eval is bad
                new_vote_count  = eval(candidate.vote_count) + eval(candidate.body.vote_count);
                candidate.update({
                    vote_count: new_vote_count
                });
            }
        })
    })
};
