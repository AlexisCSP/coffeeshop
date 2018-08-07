import React, { Component } from 'react';
import './Rooms.css'
import Room from './Room.jsx'
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import cookie from 'react-cookies'

const haversine = require('haversine');

class Rooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: 300,
      slider: {
        min: 0,
        max: 500,
        step: 100,
      },
      roomData : {
        candidates: []
      }
    };
  }

  withinRange(start, end, radius) {
    console.log(radius);
    if (end !== null) {
      return haversine({latitude: start.latitude, longitude: start.longitude}, {latitude: end.latitude, longitude: end.longitude}, {unit: 'meter'}) <=radius;
    }
    return true;
  }


  logout() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  }

  render() {
    return (
      <Router>
        <div style={{ display: "flex" }}>
          <div id="sidebar">
            <h1>Coffee Shop</h1>
            <div>
                <Slider min={this.state.slider.min} max={this.state.slider.max} step={this.state.slider.step}
                  defaultValue={this.state.currentValue}
                  marks={{100: "100", 200: "200", 300: "300", 400: "400", 500: "500"}}
                  onChange={(value) => {
                    this.setState({currentValue: value}, () => {console.log(value)})
                  }}
                  />
              </div>
            <ul>
              {this.props.rooms.filter(room => this.withinRange(room, this.props.coords, this.state.currentValue)).map(room =>
              <li key={room.id}><NavLink class="sidebar-button" to={"/rooms/" + room.id}  activeClassName="selected">{room.title}</NavLink></li>)}
            </ul>
            {this.props.isLoggedIn && <p class="sidebar-button" id="new-room-btn" onClick={this.props.openModal}>Create New Room</p>}
            {!this.props.isLoggedIn && <a class="sidebar-button" href="http://localhost:3001/spotify/login" id="login-logout">Login</a>}
            {this.props.isLoggedIn && <a class="sidebar-button" href="/" id="login-logout" onClick={this.logout}>Logout</a>}
          </div>
          <div id="content">
            {this.props.rooms.map((room, index) => (
            <Route
              key={index}
              path={"/rooms/" + room.id}
              component={() => <Room id={room.id} isLoggedIn={this.props.isLoggedIn} isRoomOwner={cookie.load('spotify_id') === room.owner}/>} />
            ))}
          </div>
        </div>
      </Router>
    )
  }
}

export default Rooms;
