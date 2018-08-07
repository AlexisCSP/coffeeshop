window.onSpotifyWebPlayerSDKReady = () => {};

async function waitForSpotifyWebPlaybackSDKToLoad () {
  return new Promise(resolve => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });
};

async function checkSelectedPlayer (sdk) {
  return new Promise(resolve => {
    let interval = setInterval(async () => {
      let state = await sdk.getCurrentState();
      if (state !== null) {
        resolve(state);
        clearInterval(interval);
      }
    });
  });
};

(async () => {
  const { Player } = await waitForSpotifyWebPlaybackSDKToLoad();
  const token = getCookie('access_token');
  const player = new Player({
    name: "Coffee Shop",
    getOAuthToken: callback => { callback(token); }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  player.on("player_state_changed", state => {
    // Update UI with playback state changes
    if (player.state && !player.state.paused && state && state.paused && state.position === 0) {
      console.log('Track ended');
      socket.emit('play next song');
    }
    player.state = state;
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    transferPlayback(device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  let connected = await player.connect();
  if (connected) {
    let state = await checkSelectedPlayer(player);
    await player.resume();
    await player.setVolume(0.5);
    let {
      id,
      uri: track_uri,
      name: track_name,
      duration_ms,
      artists,
      album: {
        name: album_name,
        uri: album_uri,
        images: album_images
      }
    } = state.track_window.current_track;
    console.log(`You're listening to ${track_name} by ${artists[0].name}!`);

    // let togglePlayButton = document.getElementById('toggle-play');
    // togglePlayButton.onclick = async function() { 
    //   await player.togglePlay().then(() => {
    //     console.log("Playback toggled!");
    //   });
    // }

    // let skipTrackButton = document.getElementById('skip-track');
    // skipTrackButton.onclick = async function() { 
    //   socket.emit('play next song');
    //   console.log('Set to next track!');
    //   // await player.nextTrack().then(() => {
    //   // });
    // }

  };
})();

// // Play a specified track on the Web Playback SDK's device ID
// function play() {
//   console.log('Entering play function');
//   socket.emit('request to play', room_id);

//   socket.on('play song', (spotify_uri) => {
//     console.log('Playing...', spotify_uri);

//     SpotifyWebApi.play()
//     $.ajax({
//       url: 'https://api.spotify.com/v1/me/player/play',
//       type: 'PUT',
//       data: JSON.stringify({ uris: [spotify_uri] }),
//       beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + access_token );},
//       success: () => { 
//         console.log('Successful play request...');
//       }
//     }).then(() => {
//       console.log('Playing music...');
//     });
//   });
// }

// function pausePlayback() {
//   spotifyApi.pause();
//   // fetch('https://api.spotify.com/v1/me/player/pause', {
//   //   method: 'PUT',
//   //   headers: {
//   //    'Authorization': 'Bearer ' + access_token,
//   //   }
//   // })
//   // .then(() => {
//   //   console.log("Playback paused...");
//   // })
//   // .catch(error => {
//   //      // handle error
//   // });
// }

// // Transfer playback to Web Playback SDK's
// function transferPlayback(device_id) {
//   pausePlayback();
//   spotifyApi.transferMyPlayback(device_id);
//   // fetch('https://api.spotify.com/v1/me/player/player', {
//   //   method: 'PUT',
//   //   headers: {
//   //    'Authorization': 'Bearer ' + access_token,
//   //   }
//   // })
//   // .then(() => {
//   //   console.log("Playback paused...");
//   // })
//   // .catch(error => {
//   //      // handle error
//   // });
//   // $.ajax({
//   //  url: "https://api.spotify.com/v1/me/player",
//   //  type: "PUT",
//   //  data: '{"device_ids": ["' + device_id + '"], "play": false}',
//   //  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + access_token );},
//   //  success: function() { 
//   //    console.log("Playback transfered...");
//   //  }
//   // });
// }

// $('#play').on('click', () => {
//   play();
// })

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}