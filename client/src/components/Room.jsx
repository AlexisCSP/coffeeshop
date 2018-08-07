import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'
import Song from './Song.jsx'
import Player from './Player.jsx'
import { emitJoinRoom, onSongSuggested, onSongUpvoted, onSongDownvoted, emitSongSuggested, emitSongUpvoted, emitSongDownvoted } from './socketApi';

class Room extends Component {
  constructor(props) {
    super(props);
    this.onUpvoteClick = this.onUpvoteClick.bind(this);
    this.onDownvoteClick = this.onDownvoteClick.bind(this);
    this.onSearchItemClick = this.onSearchItemClick.bind(this);
    this.fetchCandidatesData = this.fetchCandidatesData.bind(this);

    this.state = {
      roomData : {
        candidates: []
      }
    };

    emitJoinRoom(props.id)
    onSongSuggested(this.fetchCandidatesData)
    onSongUpvoted(this.fetchCandidatesData)
    onSongDownvoted(this.fetchCandidatesData)
  }

  componentDidMount() {
    this.fetchRoomData()
  }

  fetchRoomData() {
    fetch('http://localhost:3001/rooms/' + this.props.id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(roomData => this.setState({ roomData } ))
    .catch(error => {
         // handle error
    });
  }

  fetchCandidatesData() {
    fetch('http://localhost:3001/rooms/' + this.props.id + '/candidates', {
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
    fetch('http://localhost:3001/candidate/upvote', {
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
    }).then(() => {
                    emitSongUpvoted();
                    this.fetchCandidatesData();})
    }

  onDownvoteClick(songId) {
    fetch('http://localhost:3001/candidate/downvote', {
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
    }).then(() => {
                    emitSongDownvoted();
                    this.fetchCandidatesData();})

  }

  onSearchItemClick(song) {
    fetch('http://localhost:3001/candidate/new', {
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
        duration_ms: song.duration_ms,
        preview: song.preview,
        album_name: song.album_name,
        album_image: song.album_image
      })
    }).then(() => {
                    emitSongSuggested();
                    this.fetchCandidatesData();})
  }

  render() {
    return (
      <div id="content-wrapper">
        <Search onSearchItemClick={this.onSearchItemClick}/>
        <ul>
          {this.state.roomData.candidates.map(song =>
          <li key={song.id}>
            <Song song={song}
                  onUpvoteClick={this.onUpvoteClick}
                  onDownvoteClick={this.onDownvoteClick}
            />
          </li>)}
        </ul>
        {(this.props.isLoggedIn && this.props.isRoomOwner) &&
        <Player id={this.props.id}
                candidates={this.state.roomData.candidates}
                fetchCandidates={this.fetchCandidatesData}
        />}
      </div>
    )
  }

}

export default Room;
