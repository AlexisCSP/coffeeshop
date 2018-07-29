const models = require('../models');
const { body, query, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
const candidateHelper = require('../helpers/candidateHelper');
const numberUtility = require('../utilities/numberUtitlity');
const voteHelper = require('./voteHelper');
const userHelper = require('./userHelper');

// Returns an object with the following structure
// [
//     {
//         candidate: {
//             id: <Id of the candidate object>,
//             songId: <Id of the song that was suggested>,
//         },
//        user: {
//            id: <Id of the user>,
//            username: <Username of the user>
//        },
//         count: <Number of votes for the candidate>
//     },
//     .
//     .
//     .
// ]
exports.getCandidates = (roomId) => {
    return new Promise((resolve, reject) => {
        models.Candidate.findAll({
            where: {RoomId: roomId}
        }).then(candidates => {
                candidates.sort(function(a, b) {
                    if (a.vote_count == b.vote_count) {
                        return a.SongId > b.SongId; // change to timestamp
                    }
                    return b.vote_count - a.vote_count;
                });
                resolve(candidates);
            });
        });

};

// Returns no object
exports.createNewCandidate = (roomId, songId, userId) => {
    return new Promise((resolve, reject) => {
        models.Candidate.create({
            RoomId: roomId,
            SongId: songId,
            UserId: userId,
            vote_count: 1
        })
        resolve();
    });
};

exports.commit_vote = (data, type) => {
    return new Promise((resolve, reject) => {
        models.Candidate.findOne({
            where: {
                RoomId: data.roomId,
                SongId: data.candidateId,
                UserId: data.userId
            }
        }).then(candidate => {
            var new_vote_count = candidate.vote_count;
            if (type == "upvote") {
                new_vote_count += 1;
            } else {
                new_vote_count -= 1;
            }
            candidate.update({
                vote_count: new_vote_count
            }).then(() => {})
            resolve();
        });
    });
};

exports.vote = (req, res, type) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        /* TODO fill in proper error handling here */
        return;
    }
    var data = {
        userId: req.query.UserId,
        candidateId: req.query.SongId,
        roomId: req.query.RoomId
    }

    if (data.userId && data.userId != null && numberUtility.isNumeric(data.userId)){
        data.userId = parseInt(userId);
    } else {
        data.userId = null;
    }

    this.commit_vote(data, type);
    res.redirect(`/rooms/${data.roomId}`);

};

// // Returns the room id (integer) that corresponds to the candidate id
// exports.getRoomIdForCandidate = (candidateId) => {
//     return new Promise((resolve, reject) => {
//         models.Candidate.findById(candidateId).then(candidate => {
//             resolve(candidate.dataValues.RoomId);
//         });
//     });
// };

//Return the following object
// {
//     id: <Id of the candidate>,
//     songId: <Id of the song>,
//     count: <Vote count for this candidate>,
//     user: {
//         id: <Id of the user that owns the candidate>,
//         usernameL <Username of the user that owns the candidate>
//     }
// }
// Returns a promise to make the code using this easier to use
// function makeCandidateObject(candidate){
//     return new Promise((resolve, reject) => {
//         Promise.all([
//             voteHelper.getVoteCountForCandidate(candidate.dataValues.id),
//             userHelper.getUserById(candidate.dataValues.UserId)
//         ]).then(pieces => {
//             const voteCount = pieces[0];
//             const user = pieces[1];

//             resolve({
//                 id: candidate.dataValues.id,
//                 songId: candidate.dataValues.SongId,
//                 count: voteCount,
//                 user: user
//             });
//         });
//     });
// }

