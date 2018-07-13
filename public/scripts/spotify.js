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

async function waitUntilUserHasSelectedPlayer (sdk) {
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
  });


  // Ready
  sdk.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
  });

  // Not Ready
  sdk.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  let connected = await sdk.connect();
  if (connected) {
    //let state = await selectPlayer(device_id);
    let state = await waitUntilUserHasSelectedPlayer(sdk);
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
  }
})();