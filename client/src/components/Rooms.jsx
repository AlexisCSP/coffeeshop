import React, { Component } from 'react';
import './Rooms.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Rooms extends Component {

  render() {
    return (
      <Router>
        <div id="sidebar">
        <ul>
          {this.props.rooms.map(room =>
          <li key={room.id}><Link to={"/rooms/" + room.id}>{room.title}</Link></li>)}
        </ul>

        <div style={{ flex: 1, padding: "10px" }}>
          {this.props.rooms.map((room, index) => (
          <Route
            key={index}
            path={"/rooms/" + room.id}
            component={() => <h2>{room.title}</h2>} /> // TODO create a React component for Room
        ))}
        </div>
        </div>
      </Router>
    )
  }
}

export default Rooms;
