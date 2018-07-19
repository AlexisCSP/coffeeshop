import React, { Component } from 'react';
import './Room.css'
import Search from './Search.jsx'

  const songList = [
    {
      title : "Test Song 1"
    }, {
      title : "Test Song 2"
    }, {
      title : "Test Song 3"
    }
  ] // TO DO get actual list of songs for each room once endpoint is built

class Room extends Component {

  render() {
    return (
      <div>
        <Search/>
        <ul>
          {songList.map(song =>
          <li>{song.title} {this.props.title}</li>)}
        </ul>
      </div>
    )
  }
}

export default Room;
