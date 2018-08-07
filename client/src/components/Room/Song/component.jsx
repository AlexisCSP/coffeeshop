import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Song extends Component {
  render() {
    return (
      <div>
        <span><img src={this.props.song.album_image} alt={this.props.song.album_name} height={40} width={40}/></span>
        <span>{this.props.song.song} - {this.props.song.artist} ({this.props.song.vote_count})</span>
        <span className="song-upvote-icon" onClick={()=>this.props.onUpvoteClick(this.props.song.id)}><FontAwesomeIcon icon="thumbs-up"/></span>
        <span className="song-downvote-icon" onClick={()=>this.props.onDownvoteClick(this.props.song.id)}><FontAwesomeIcon icon="thumbs-down"/></span>
      </div>
    )
  }
}

export default Song;
