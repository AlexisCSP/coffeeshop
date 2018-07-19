const {body, query, validationResult} = require('express-validator/check');
const {sanitizeBody, sanitizeQuery} = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const voteHelper = require('../helpers/voteHelper');
const numberUtility = require('../utilities/numberUtitlity');

exports.createNewVote = [
    query('CandidateId', 'CandidateId must be provided').exists().isAlpha(),
    sanitizeQuery('CandidateId').toInt(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            /* TODO fill in proper error handling here */
            return;
        }

        var userId = req.query.UserId;
        var candidateId = req.query.CandidateId;

        if (userId && userId != null && numberUtility.isNumeric(userId)){
            userId = parseInt(userId);
        } else {
            userId = null;
        }

        Promise.all([
            candidateHelper.getRoomIdForCandidate(candidateId),
            voteHelper.createNewVote(candidateId, userId)
        ]).then(results => {
            const roomId = results[0];
            res.redirect(`/rooms/${roomId}`);
        });

    }
];