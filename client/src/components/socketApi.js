import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

function subscribeToSongSuggested(callback) {
  socket.on('song suggested', () => callback(null));
}

function subscribeToSongUpvoted(callback) {
  socket.on('user voted up', () => callback(null));
}

function subscribeToSongDownvoted(callback) {
  socket.on('user voted down', () => callback(null));
}

function emitSongSuggested(data) {
  socket.emit('song suggested', data)
}

function emitSongUpvoted(data) {
  socket.emit('user voted up', data)
}

function emitSongDownvoted(data) {
  socket.emit('user voted down', data)
}

export { subscribeToSongSuggested, subscribeToSongUpvoted, subscribeToSongDownvoted, emitSongSuggested, emitSongUpvoted, emitSongDownvoted };
