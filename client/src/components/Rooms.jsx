import React, { Component } from 'react';
import './Rooms.css'
import Room from './Room.jsx'
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

class Rooms extends Component {

  render() {
    return (
      <Router>
        <div style={{ display: "flex" }}>
          <div id="sidebar">
            <ul>
              {this.props.rooms.map(room =>
              <li key={room.id}><NavLink to={"/rooms/" + room.id}  activeClassName="selected">{room.title}</NavLink></li>)}
            </ul>
          </div>

          <div style={{ flex: 1, padding: "10px" }}>
            {this.props.rooms.map((room, index) => (
            <Route
              key={index}
              path={"/rooms/" + room.id}
              component={() => <Room title={room.title}/>} /> // TODO create a React component for Room
            ))}
          </div>
        </div>
      </Router>
    )
  }
}

export default Rooms;
