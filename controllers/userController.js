const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const userHelper = require('../helpers/userHelper');
const models = require('../models');

exports.createNewUser = [
    body('Username', 'Username is required and must be a string')
        .isLength({min: 1}),
    sanitizeBody('Username')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return;
        }

        userHelper.createUser(req.body.Username)
            .then(() => {
                res.redirect(`/users/`);
            }
        );
    }
];

exports.getUserListView = [
    (req, res, next) => {
        userHelper.getAllUsers().then(users => {
            res.render('user_list', {
                title: 'List of all users',
                users: users
            });
        });
    }
];

exports.getNewUserForm = [
    (req, res, next) => {
        res.render('user_form', {title: 'Create a new user'});
    }
];

exports.isOwner = function(req, res, next) {
    models.Room.findAll({
        where: { id: req.params.id },
        plain: true
    }).then(function(room) {
        if (req.cookies.spotify_id === room.owner)
            return next();
        res.redirect("/");
    })
}
