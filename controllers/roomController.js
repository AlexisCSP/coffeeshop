const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// var Room = require('../models/room');
// var Author = require('../models/song');
// var Genre = require('../models/room-song');

var async = require('async');

exports.index = function(req, res) {
  res.render('index', { title: 'Coffee Shop' });

};

// Display list of all books.
exports.room_list = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Room list');
};

// Display detail page for a specific room.
exports.room_detail = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Room detail');
};

// Display book create form on GET.
exports.room_create_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Room create GET');
};

exports.room_create_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: Room create POST');
};

// Handle book create on POST.
exports.room_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Room delete GET');
};

// Handle room delete on POST.
exports.room_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Room delete POST');
};

// Display room update form on GET.
exports.room_update_get = function(req, res, next) {
};

// Handle room update on POST.
exports.room_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Room delete POST');
};
