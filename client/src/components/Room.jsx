import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'
import Song from './Song.jsx'
import Player from './Player.jsx'
import Script from 'react-load-script'
import SpotifyWebApi from 'spotify-web-api-js';
import cookie from 'react-cookies'
const spotifyApi = new SpotifyWebApi();

class Room extends Component {
  constructor(props) {
    super(props);
    this.onUpvoteClick = this.onUpvoteClick.bind(this);
    this.onDownvoteClick = this.onDownvoteClick.bind(this);
    this.onSearchItemClick = this.onSearchItemClick.bind(this);

    this.state = { roomData : {
      candidates: []}
    };
    if (this.props.isLoggedIn) {
      console.log("ACCESS GRANTED");
      const access_token = cookie.load('access_token');
      spotifyApi.setAccessToken(access_token);
    }
  }

  componentDidMount() {
    this.fetchRoomData()
  }

  fetchRoomData() {
    fetch('/rooms/' + this.props.id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(roomData => this.setState({ roomData : roomData } ))
    .catch(error => {
         // handle error
    });
  }

  fetchCandidatesData() {
    fetch('/rooms/' + this.props.id + '/candidates', {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(candidatesData => {
      var roomData = {...this.state.roomData}
      roomData.candidates = candidatesData;
      this.setState({roomData})
    })
    .catch(error => {
         // handle error
    });
  }

  onUpvoteClick(songId) {
    fetch('/candidate/upvote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: this.props.id,
        songId: songId,
        userId: 1
      })
    }).then(() => this.fetchCandidatesData())
  }

  onDownvoteClick(songId) {
    fetch('/candidate/downvote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: this.props.id,
        songId: songId,
        userId: 1
      })
    }).then(() => this.fetchCandidatesData())

  }

  onSearchItemClick(song) {
    fetch('/candidate/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: this.props.id,
        uri: song.uri,
        userId: 1,
        name: song.song,
        artist: song.artist,
        preview: song.preview,
        album_name: song.album_name,
        album_image: song.album_image
      })
    }).then(() => this.fetchCandidatesData())
  }

  render() {
    return (
      <div id="content-wrapper">
        <Search onSearchItemClick={this.onSearchItemClick}/>
        <ul>
          {this.state.roomData.candidates.map(song =>
          <li key={song.id}><Song song={song} onUpvoteClick={this.onUpvoteClick} onDownvoteClick={this.onDownvoteClick}/></li>)}
        </ul>
        <Player />
        <Script
          url="https://sdk.scdn.co/spotify-player.js"
          onCreate={this.handleScriptCreate.bind(this)}
          onError={this.handleScriptError.bind(this)}
          onLoad={this.handleScriptLoadPlayer.bind(this)}
        />
       </div>
    )
  }

  handleScriptCreate() {
    this.setState({ scriptLoaded: false })
  }
  
  handleScriptError() {
    this.setState({ scriptError: true })
  }
  
  handleScriptLoad() {
    this.setState({ scriptLoaded: true })
  }

  handleScriptLoadPlayer() {
    this.setState({ scriptLoaded: true })
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
      const token = cookie.load('access_token');
      spotifyApi.setAccessToken(token);
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
        }
        player.state = state;
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        spotifyApi.transferMyPlayback([device_id]);
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

      };
    })();

  }

}

export default Room;
