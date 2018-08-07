const roomReducer = (state = {
  songs: [],
  clients: [],
  currentSong: null,
  hasNext: false
}, action) => {
  console.log(action);
  switch(action.type) {
    case 'ON_SONG_QUEUE_UPDATED':
      return {
        ...state,
        songs: action.songs,
        hasNext: action.songs.length > 0
      }
    case 'ON_NOW_PLAYING_UPDATED':
      return {
        ...state,
        nowPlaying: action.song
      }
    case 'ON_CLIENTS_UPDATED':
      return {
        ...state,
        clients: action.clients
      }
    case 'ON_PLAY_SONG':
      return {
        ...state,
        currentSong: action.song
      }
    default:
      return state;
  }
}

export { roomReducer };
