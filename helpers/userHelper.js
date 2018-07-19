const models = require('../models');

// Returns the following object
// [
//     {
//         id: <ID of the user>,
//         username: <Username of the user>
//     }
//     .
//     .
//     .
// ]
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        models.User.findAll().then(users => {
            resolve(users.map(user => {
                    return {
                        id: user.dataValues.id,
                        username: user.dataValues.Username
                    };
                })
            );
        });
    });
};

// Returns no object
exports.createUser = (username) => {
    return new Promise((resolve, reject) => {
        models.User.create({Username: username}).then(() => {
            resolve();
        });
    });
};

//Returns the following object
// {
//     id: <Id of the user>,
//     username: <Username of the user>
// }
exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        console.log(`====== Asking For User With ID ${userId}`);
        models.User.findById(userId).then(user => {
            if (user === null){
                resolve({
                    id: null,
                    username: "ANONYMOUS"
                }); 
            } else {
                resolve({
                    id: user.dataValues.id,
                    username: user.dataValues.Username
                });
            }
        });
    });
}