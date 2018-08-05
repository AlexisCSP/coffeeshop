import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'
import Song from './Song.jsx'

class Room extends Component {
  constructor(props) {
    super(props);
    this.onUpvoteClick = this.onUpvoteClick.bind(this);
    this.onDownvoteClick = this.onDownvoteClick.bind(this);
    this.onSearchItemClick = this.onSearchItemClick.bind(this);

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
      </div>
    )
  }
}

export default Room;
