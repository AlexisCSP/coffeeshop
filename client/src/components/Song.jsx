import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Song.css'

class Song extends Component {
  render() {
    return (
      <div>
          <span>Song Id : {this.props.song.songId} Votes : {this.props.song.count}</span>
          <span className="song-upvote-icon"><FontAwesomeIcon icon="thumbs-up"/></span>
          <span className="song-downvote-icon"><FontAwesomeIcon icon="thumbs-down"/></span>
      </div>
    )
  }
}

export default Song;
