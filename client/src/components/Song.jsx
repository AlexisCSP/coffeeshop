import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Song.css'

class Song extends Component {
  render() {
    return (
      <div>
          <span>Song Id : {this.props.song.SongId} Votes : {this.props.song.vote_count}</span>
          <span className="song-upvote-icon" onClick={()=>this.props.onUpvoteClick(this.props.song.SongId)}><FontAwesomeIcon icon="thumbs-up"/></span>
          <span className="song-downvote-icon" onClick={()=>this.props.onDownvoteClick(this.props.song.SongId)}><FontAwesomeIcon icon="thumbs-down"/></span>
      </div>
    )
  }
}

export default Song;
