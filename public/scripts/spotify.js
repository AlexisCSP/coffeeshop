window.onSpotifyWebPlayerSDKReady = () => {};

var d_id = null;

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
  const token = access_token;
  const sdk = new Player({
    name: "CoffeeShop",
    getOAuthToken: callback => { callback(token); }
  });

  // Error handling
  sdk.addListener('initialization_error', ({ message }) => { console.error(message); });
  sdk.addListener('authentication_error', ({ message }) => { console.error(message); });
  sdk.addListener('account_error', ({ message }) => { console.error(message); });
  sdk.addListener('playback_error', ({ message }) => { console.error(message); });

  sdk.on("player_state_changed", state => {
    // Update UI with playback state changes
    if (sdk.state && !sdk.state.paused && state.paused && state.position === 0) {
      console.log('Track ended');
    }
    sdk.state = state;
  });


  // Ready
  sdk.addListener('ready', ({ device_id }) => {
    d_id = device_id;
    console.log('Ready with Device ID', device_id);
    transferPlayback();
  });

  // Not Ready
  sdk.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  let connected = await sdk.connect();
  if (connected) {
    let state = await checkSelectedPlayer(sdk);
    await sdk.resume();
    await sdk.setVolume(0.5);
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

    let togglePlayButton = document.getElementById('togglePlay');
    togglePlayButton.onclick = async function() { 
      await sdk.togglePlay().then(() => {
        console.log("Playback toggled!");
      });
    }

    let skipTrackButton = document.getElementById('skipTrack');
    skipTrackButton.onclick = async function() { 
      await sdk.nextTrack().then(() => {
        console.log('Set to next track!');
      });
    }

  };
})();

// Play a specified track on the Web Playback SDK's device ID
function play() {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + d_id,
   type: "PUT",
   data: '{"uris": ["spotify:track:4kWO6O1BUXcZmaxitpVUwp"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + access_token );},
   success: function(data) { 
     // console.log(data);
   }
  });
}

function pausePlayback() {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/pause",
   type: "PUT",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + access_token );},
   success: function() { 
     console.log("Playback paused");
   }
  });
}

// Transfer playback to Web Playback SDK's
function transferPlayback() {
  pausePlayback();
  $.ajax({
   url: "https://api.spotify.com/v1/me/player",
   type: "PUT",
   data: '{"device_ids": ["' + d_id + '"], "play": false}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + access_token );},
   success: function() { 
     console.log("Playback transfered");
   }
  });
}

let playButton = document.getElementById('play');
playButton.onclick = function() { 
  play(d_id); 
  console.log('Playing music');
};
