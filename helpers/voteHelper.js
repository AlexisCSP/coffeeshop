const models = require('../models');

// Return no object
exports.createNewVote = (candidateId, userId) => {
    return new Promise((resolve, reject) => {
        models.Vote.create({
            CandidateId: candidateId,
            UserId: userId
        }).then(() => {
            resolve();
        });
    });
};

exports.getVoteCountForCandidate = (candidateId) => {
    return new Promise((resolve, reject) => {
        models.Vote.count({where: {CandidateId: candidateId}}).then(count => {
            console.log(`Got ${count} votes for candidate ${candidateId}`);
            resolve(count);
        });
    });
};