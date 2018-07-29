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
    /*var xhr = new XMLHttpRequest();
    xhr.open('POST', '/candidate/upvote');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const data = {
      RoomId: this.props.id,
      SongId: songId,
      UserId: 1
    }
    xhr.send(JSON.stringify(data));*/
    fetch('/candidate/upvote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        RoomId: this.props.id,
        SongId: songId,
        UserId: 1
      })
    }).then(() => this.fetchCandidatesData())
  }

  onDownvoteClick(songId) {
    /*var xhr = new XMLHttpRequest();
    xhr.open('POST', '/candidate/downvote');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const data = {
      RoomId: this.props.id,
      SongId: songId,
      UserId: 1
    }
    xhr.send(JSON.stringify(data));*/
    fetch('/candidate/downvote', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        RoomId: this.props.id,
        SongId: songId,
        UserId: 1
      })
    }).then(() => this.fetchCandidatesData())

  }

  onSearchItemClick(song) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/candidate/new');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    const data = {
      RoomId: this.props.id,
      SongId: song.uri,
      UserId: 1,
      name: song.song,
      artist: song.artist,
      preview: song.preview,
      album_name: song.album_name,
      album_image: song.album_image
    }
    xhr.send(JSON.stringify(data));
    this.fetchCandidatesData()
  }

  render() {
    return (
      <div id="content-wrapper">
        <Search onSearchItemClick={this.onSearchItemClick}/>
        <ul>
          {this.state.roomData.candidates.map(song =>
          <li key={song.SongId}><Song song={song} onUpvoteClick={this.onUpvoteClick} onDownvoteClick={this.onDownvoteClick}/></li>)}
        </ul>
      </div>
    )
  }
}

export default Room;
