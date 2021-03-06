const models = require('../models');
const { body, query, validationResult } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
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
        models.Room.findById(roomId).then((room) => {
            room.getSong().then((songs) => {
                songs.sort(function(a, b) {
                    if (a.Candidate.vote_count == b.Candidate.vote_count) {
                        return a.songId > b.songId; // change to timestamp
                    }
                    return b.Candidate.vote_count - a.Candidate.vote_count;
                });
                resolve(songs);
            });
        });
    });
}

// Returns no object
exports.createNewCandidate = (data) => {
    return new Promise((resolve, reject) => {
        console.log("SEARCHING SONG");
        models.Song.findOrCreate({
            where: {uri: data.uri},
            defaults: {
                name: data.name,
                artist: data.artist,
                duration_ms: data.duration_ms,
                preview: data.preview,
                album_name: data.album_name,
                album_image: data.album_image,
                uri: data.uri,
            }
        }).spread((song, created) => {
            if (created) {
                models.Room.findById(data.roomId).then((room) => {
                    song.addRoom(room, { through: { vote_count: 1 } }).then( () => {
                        resolve();
                    });
                });
            } else {
                models.Candidate.findOne({
                    where: {
                        roomId: data.roomId,
                        songId: data.songId,
                    }
                }).then((candidate) => {
                    if (candidate !== null) {
                        this.commit_vote(data.roomId, song.id, data.userId, "upvote").then( () => {
                            resolve();
                        });
                    } else {
                        models.Room.findById(data.roomId).then((room) => {
                            song.addRoom(room, { through: { vote_count: 1 } }).then( () => {
                                resolve();
                            });
                        });
                    }
                })

            }
        });


    });
};

exports.commit_vote = (roomId, songId, userId, type) => {
    return new Promise((resolve, reject) => {
        models.Candidate.findOne({
            where: {
                roomId: roomId,
                songId: songId,
            }
        }).then((candidate) => {
            console.log(candidate);
            var new_vote_count = candidate.vote_count;
            if (type == "upvote") {
                new_vote_count += 1;
            } else {
                new_vote_count -= 1;
            }
            models.Candidate.update(
                { vote_count: new_vote_count },
                { where: {
                    roomId: roomId,
                    songId: songId,
                }
            }
        ).then(() => {
            resolve(candidate);
        });
            // candidate.update({
            //     vote_count: new_vote_count
            // }).then(() => {})

        });
    });
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
