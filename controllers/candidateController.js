const { body, query, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const numberUtility = require('../utilities/numberUtitlity');

exports.createNewCandidate = [
    body('SongId', 'Song Id is required'),
    sanitizeBody('SongId'),

    body('RoomId', 'Room Id is required').isNumeric(),
    sanitizeBody('RoomId').toInt(),

    body('UserId', 'User ID is required (May be null)').exists(),

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

        candidateHelper.createNewCandidate(roomId, songId, userId)
            .then( () => {
                res.redirect(`/rooms/${roomId}`);
            }
        );
    }
];

exports.upvoteCandidate = [
    query('SongId', 'SongId must be provided').exists(),
    sanitizeQuery('SongId'), 
    (req, res, next) => {
        candidateHelper.vote(req, res, "upvote");
    }
];

exports.downvoteCandidate = [
    query('SongId', 'SongId must be provided').exists(),
    sanitizeQuery('SongId'), 
    (req, res, next) => {
        candidateHelper.vote(req, res, "downvote");
    }
];