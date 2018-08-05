import React, { Component } from 'react';
import { PlaybackControls, MuteToggleButton, VolumeSlider, TimeMarker, ProgressBar } from 'react-player-controls';
import './Player.css'
import { ControlDirection } from 'react-player-controls/dist/components/RangeControlOverlay';
import Script from 'react-load-script'
import SpotifyWebApi from 'spotify-web-api-js';
import cookie from 'react-cookies'
const spotifyApi = new SpotifyWebApi();

class Player extends Component {

    constructor(props) {
        super(props);
        
        var next = false;
        var candidates = this.props.candidates;
        if (candidates.length > 1) {
             next = true;
        }
        console.log(candidates);
        this.state = {
            volume: 0.5,
            totalTime: 200,
            currentTime: 0,
            bufferedTime: 0,
            isSeekable: true
        };
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
        cookie.save('device_id', device_id, { path: '/' });
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

    render() {
        return (
          <div>
            <ProgressBar
                totalTime={this.state.totalTime}
                currentTime={this.state.currentTime}
                bufferedTime={this.state.bufferedTime}
                isSeekable={this.state.isSeekable}
                onSeek={time => this.setState(() => ({ currentTime: time }))}
                onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
                onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
                onIntent={time => this.setState(() => ({ lastIntent: time }))}
            />
            <TimeMarker
                totalTime={this.state.totalTime}
                currentTime={this.state.currentTime}
                markerSeparator={this.state.markerSeparator="/"}
            />
            <PlaybackControls
                isPlayable={true}
                isPlaying={this.state.isPlaying}
                showPrevious={false}
                hasPrevious={false}
                showNext={this.state.showNext}
                hasNext={this.state.hasNext}
                onPlaybackChange={isPlaying => {
                    if (this.state.isPlaying) {
                        spotifyApi.pause({});
                    } else {
                        spotifyApi.play({});
                    }
                    this.setState({ ...this.state, isPlaying });
                }}
                onPrevious={() => alert('Go to previous')}
                onNext={() => alert('Go to next')}
            />
            <MuteToggleButton
                isEnabled={true}
                isMuted={this.state.isMuted}
                onMuteChange={isMuted => {
                    if (this.state.isMuted) {
                        spotifyApi.setVolume(100*this.state.volume, {});
                    } else {
                        spotifyApi.setVolume(0, {});
                    }
                    this.setState({ ...this.state, isMuted })
                }}
            />
            <VolumeSlider
                direction={ControlDirection.HORIZONTAL}
                isEnabled={true}
                volume={this.state.volume}
                onVolumeChange={volume => {
                    spotifyApi.setVolume(100*volume, {});
                    this.setState({ ...this.state, volume }) 
                }}
            />
            <Script
                url="https://sdk.scdn.co/spotify-player.js"
                onCreate={this.handleScriptCreate.bind(this)}
                onError={this.handleScriptError.bind(this)}
                onLoad={this.handleScriptLoadPlayer.bind(this)}
            />
          </div>
        )
    }
}

export default Player;