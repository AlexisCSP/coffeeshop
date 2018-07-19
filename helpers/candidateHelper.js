const models = require('../models');
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
            Promise.all(candidates.map(makeCandidateObject)).then(results => {
                resolve(results);
            });
        });
    });
};

// Returns no object
exports.createNewCandidate = (roomId, songId, userId) => {
    return new Promise((resolve, reject) => {
        models.Candidate.create({
            RoomId: roomId,
            SongId: songId,
            UserId: userId
        }).then(candidate => {
            voteHelper.CreateVote(
                candidate.dataValues.id, 
                userId).then(() => {
                    resolve();
                });
        });
    });
};

// Returns the room id (integer) that corresponds to the candidate id
exports.getRoomIdForCandidate = (candidateId) => {
    return new Promise((resolve, reject) => {
        models.Candidate.findById(candidateId).then(candidate => {
            resolve(candidate.dataValues.RoomId);
        });
    });
};

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
function makeCandidateObject(candidate){
    return new Promise((resolve, reject) => {
        Promise.all([
            voteHelper.getVoteCountForCandidate(candidate.dataValues.id),
            userHelper.getUserById(candidate.dataValues.UserId)
        ]).then(pieces => {
            const voteCount = pieces[0];
            const user = pieces[1];

            resolve({
                id: candidate.dataValues.id,
                songId: candidate.dataValues.SongId,
                count: voteCount,
                user: user
            });
        });
    });
}