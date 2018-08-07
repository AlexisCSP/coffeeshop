import io from 'socket.io-client';
import { store } from '../../index';
let socket;

const connectToRoom = (roomId) => {
  socket = io('/rooms');
  socket.on('connect', () => {
    socket.emit('join room', roomId);
  })
  socket.on('update room queue', (songs) => {
    const currentQueueLength = store.getState().room.songs.length;
    store.dispatch({
      type: 'ON_SONG_QUEUE_UPDATED',
      songs
    })
  })
  socket.on('update vote count', (songs) => {
    store.dispatch({
      type: 'ON_SONG_QUEUE_UPDATED',
      songs
    })
  })
  socket.on('update now playing', (song) => {
    store.dispatch({
      type: 'ON_NOW_PLAYING_UPDATED',
      song
    })
  })
  socket.on('user joined room', (clients) => {
    store.dispatch({
      type: 'ON_CLIENTS_UPDATED',
      clients
    })
  })
  socket.on('user left room', (clients) => {
    store.dispatch({
      type: 'ON_CLIENTS_UPDATED',
      clients
    })
  })
  socket.on('play song', (song) => {
    console.log('on play song');
    console.log(song);
    store.dispatch({
      type: 'ON_PLAY_SONG',
      song
    })
  })
}

const addCandidate = (song) => {
  socket.emit('song suggested', song);
}

const voteUp = (song) => {
  socket.emit('user voted up', song)
}

const voteDown = (song) => {
  socket.emit('user voted down', song)
}

const playSong = () => {
  socket.emit('play next song')
}


export { connectToRoom, addCandidate, voteUp, voteDown, playSong };
