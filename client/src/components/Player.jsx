import React, { Component } from 'react';
import { PlaybackControls, MuteToggleButton, VolumeSlider, TimeMarker, ProgressBar } from 'react-player-controls';
import './Player.css'
import { ControlDirection } from 'react-player-controls/dist/components/RangeControlOverlay';
import Script from 'react-load-script'
import SpotifyWebApi from 'spotify-web-api-js';
import cookie from 'react-cookies'
import { onPlayNextSong, emitPlayNextSong } from './socketApi';

const spotifyApi = new SpotifyWebApi();

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates: [],
            volume: 0.5,
            totalTime: 200,
            currentTime: 0,
            bufferedTime: 0,
            isSeekable: true,
            hasNext: false,
        };
        window.first_playback = true
        onPlayNextSong(this.props.fetchCandidates)
    }

    tick() {
        this.setState(prevState => ({
          currentTime: prevState.currentTime + 1
        }));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ candidates: nextProps.candidates });
        var candidates = nextProps.candidates;
        if (candidates.length > 1) {
            this.setState({ hasNext: true });
        } else {
            this.setState({ hasNext: false });
        }
        if (candidates.length === 0) {
            this.setState({ isPlayable: false });
        } else {
            this.setState({ totalTime: Math.round(candidates[0].duration_ms/1000) });
            this.setState({ bufferedTime: Math.round(candidates[0].duration_ms/1000) });
            this.setState({ isPlayable: true });
        }
    }

    play() {
        if (this.state.candidates.length > 0) {
            // not working, always start from beginning
            if (window.first_playback) {
                spotifyApi.play({uris: [this.state.candidates[0].uri]});
                this.dequeue();
                window.first_playback = false
            } else {
                console.log("here");
                spotifyApi.play({});
            }
            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        clearInterval(this.interval);
        spotifyApi.pause({});
    }

    next() {
        this.pause();
        setTimeout(function() { }, 500);
        clearInterval(this.interval);
        this.setState({currentTime: 0});
        window.first_playback = true;
        if (this.state.isPlaying) {
            this.play();
        }
    }

    dequeue() {
        fetch('http://localhost:3001/rooms/' + this.props.id + '/dequeue', {
          method: 'POST',
          headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
          }
        })
        .catch(error => {
             // handle error
        }).then(() => {
            this.props.fetchCandidates();
            emitPlayNextSong();
        })
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
          this.next();
        }
        player.state = state;
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        spotifyApi.transferMyPlayback([device_id], {play: false});
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
          name: track_name,
          artists,
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
                onSeek={time => this.setState({currentTime: time }, (time) => {
                     spotifyApi.seek(Math.ceil(this.state.currentTime*1000), {});
                    }
                )}
                onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
                onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
                onIntent={time => this.setState(() => ({ lastIntent: time }))}
            />
            <TimeMarker
                totalTime={this.state.totalTime}
                currentTime={this.state.currentTime}
                markerSeparator= "/"
            />
            <PlaybackControls
                style="dispaly: inline;"
                isPlayable={this.state.isPlayable}
                isPlaying={this.state.isPlaying}
                showPrevious={false}
                hasPrevious={false}
                showNext={this.state.showNext}
                hasNext={this.state.hasNext}
                onPlaybackChange={isPlaying => {
                    if (this.state.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                    this.setState({ ...this.state, isPlaying });
                }}
                onPrevious={() => alert('Go to previous')}
                onNext={() => {
                    this.next();
                }}
            />
            <MuteToggleButton
                style="display: inline;"
                isEnabled={true}
                isMuted={this.state.isMuted}
                onMuteChange={isMuted => {
                    if (this.state.isMuted) {
                        spotifyApi.setVolume(Math.round(100*this.state.volume), {});
                    } else {
                        spotifyApi.setVolume(0, {});
                    }
                    this.setState({ ...this.state, isMuted })
                }}
            />
            <VolumeSlider
                style="display: inline-block;"
                direction={ControlDirection.HORIZONTAL}
                isEnabled={true}
                volume={this.state.volume}
                onVolumeChange={volume => {
                    spotifyApi.setVolume(Math.round(100*volume), {});
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
