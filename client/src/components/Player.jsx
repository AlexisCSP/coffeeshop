import React, { Component } from 'react';
import { PlaybackControls, MuteToggleButton, VolumeSlider, TimeMarker, ProgressBar } from 'react-player-controls';
import './Player.css'
import { ControlDirection } from 'react-player-controls/dist/components/RangeControlOverlay';

class Player extends Component {
    render() {
        return (
          <div>
            <ProgressBar
                totalTime={200}
                currentTime={100}
                bufferedTime={0}
                isSeekable={true}
                onSeek={time => this.setState(() => ({ currentTime: time }))}
                onSeekStart={time => this.setState(() => ({ lastSeekStart: time }))}
                onSeekEnd={time => this.setState(() => ({ lastSeekEnd: time }))}
                onIntent={time => this.setState(() => ({ lastIntent: time }))}
            />
            <TimeMarker
                totalTime={200}
                currentTime={100}
                markerSeparator={"/"}
            />
            <PlaybackControls
                isPlayable={true}
                isPlaying={false}
                showPrevious={false}
                hasPrevious={false}
                showNext={true}
                hasNext={false}
                onPlaybackChange={isPlaying => this.setState({ ...this.state, isPlaying })}
                onPrevious={() => alert('Go to previous')}
                onNext={() => alert('Go to next')}
            />
            <MuteToggleButton
                isEnabled={true}
                isMuted={false}
                onMuteChange={isMuted => this.setState({ ...this.state, isMuted })}
            />
            <VolumeSlider
                direction={ControlDirection.HORIZONTAL}
                isEnabled={true}
                volume={0.5}
                onVolumeChange={volume => this.setState({ ...this.state, volume })} 
            />
          </div>
        )
    }
}

export default Player;