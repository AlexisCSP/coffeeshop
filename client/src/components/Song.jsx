import React, { Component } from 'react';

class Song extends Component {
  render() {
    return (
      <div>
        <p>
          <span>Song Id : {this.props.song.songId} Votes : {this.props.song.count}</span>
          <span><i className="icon-upvote fa fa-arrow-up"></i></span>
          </p>
      </div>
    )
  }
}

export default Song;
