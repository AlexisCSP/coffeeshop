import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = { roomData : {
      candidates: []}
    };
  }

  componentDidMount() {
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

  render() {
    return (
      <div id="content-wrapper">
        <Search/>
        <ul>
          {this.state.roomData.candidates.map(song =>
          <li key={song.songId}>Song Id : {song.songId} Votes : {song.count}</li>)}
        </ul>
      </div>
    )
  }
}

export default Room;
