require('dotenv').config();
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');

const indexRouter = require('./routes/index');
const spotifyRouter = require('./routes/spotify');
const roomsRouter = require('./routes/rooms');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add socket listening to middleware
app.use((req, res, next) => {
  // res.io = io;
  console.log('io middleware called');
  io.sockets.on('connection', (socket) => {
    let roomID;
    console.log('connection from '+socket.id)
    socket.on('join', (room) => {
      roomID = room;
      socket.join(room);
      if(!socket['numUsers'+room]){ socket['numUsers'+room]=0; }
      io.to(room).emit('user joined', ++socket['numUsers'+room]);
      console.log('joined and emitted to '+room);
    });
    socket.on('disconnect', () => {
      console.log('user leaving '+roomID);
      io.to(roomID).emit('user left', --socket['numUsers'+roomID]);
      socket.leave(roomID);
    })
  }); 
  next();
}); 

app.use('/', indexRouter);
app.use('/spotify', spotifyRouter);
app.use('/rooms', roomsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
