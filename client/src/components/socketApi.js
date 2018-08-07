import io from 'socket.io-client';
const  socket = io('http://localhost:3001/rooms');

function emitJoinRoom() {
  socket.emit('join room')
}

function onSongSuggested(callback) {
  socket.on('update room queue', () => callback(null));
}

function onSongUpvoted(callback) {
  socket.on('update vote count', () => callback(null));
}

function onSongDownvoted(callback) {
  socket.on('update vote count', () => callback(null));
}

function onPlayNextSong(callback) {
  socket.on('play next song', () => callback(null));
}

function emitSongSuggested() {
  socket.emit('song suggested')
}

function emitSongUpvoted() {
  socket.emit('user voted up')
}

function emitSongDownvoted() {
  socket.emit('user voted down')
}

function emitPlayNextSong() {
  socket.emit('play next song')
}

export { emitJoinRoom, onSongSuggested, onSongUpvoted, onSongDownvoted,
  onPlayNextSong, emitSongSuggested, emitSongUpvoted, emitSongDownvoted, emitPlayNextSong };
