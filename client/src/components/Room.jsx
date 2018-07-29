import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'
import Song from './Song.jsx'

class Room extends Component {
  constructor(props) {
    super(props);
    this.onUpvoteClick = this.onUpvoteClick.bind(this);
    this.onDownvoteClick = this.onDownvoteClick.bind(this);

    this.state = { roomData : {
      candidates: []}
    };
  }

  componentDidMount() {
    this.fetchRoomData()
  }

  fetchRoomData() {
    fetch('/rooms/' + this.props.id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
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
    console.log("upvoting " + songId)
  }

  onDownvoteClick(songId) {
    console.log("downvoting " + songId)
  }

  render() {
    return (
      <div id="content-wrapper">
        <Search/>
        <ul>
          {this.state.roomData.candidates.map(song =>
          <li key={song.SongId}><Song song={song} onUpvoteClick={this.onUpvoteClick} onDownvoteClick={this.onDownvoteClick}/></li>)}
        </ul>
      </div>
    )
  }
}

export default Room;
