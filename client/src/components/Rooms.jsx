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
            <h1>Coffee Shop</h1>
            <ul>
              {this.props.rooms.map(room =>
              <li key={room.id}><NavLink to={"/rooms/" + room.id}  activeClassName="selected">{room.title}</NavLink></li>)}
            </ul>
            {!this.props.isLoggedIn && <a href="http://localhost:3001/spotify/login" id="login-logout">Login</a>}
            {this.props.isLoggedIn && <a href="http://localhost:3001/spotify/logout" id="login-logout">Logout</a>}
          </div>

          <div id="content">
            {this.props.rooms.map((room, index) => (
            <Route
              key={index}
              path={"/rooms/" + room.id}
              component={() => <Room id={room.id}/>} />
            ))}
          </div>
        </div>
      </Router>
    )
  }
}

export default Rooms;
