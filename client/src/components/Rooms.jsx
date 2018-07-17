import React, { Component } from 'react';
import './Rooms.css'

class Rooms extends Component {
  render() {
    return (
      <div>
        <h1>Rooms</h1>
        <ul>
          {this.props.rooms.map(room =>
          <li key={room.id}><a href={'/rooms/'+room.id}>{room.title}</a></li>
        )}
        </ul>
      </div>
    );
  }
}

export default Rooms;
