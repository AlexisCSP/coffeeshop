import React, { Component } from 'react';
import './App.css';
import Rooms from './components/Rooms'

class App extends Component {
  state = { rooms: [] }

  componentDidMount() {
     fetch('/rooms')
     .then(res => res.json())
     .then(rooms => this.setState({ rooms : rooms }))
     .catch(error => {
          // handle error
     });
  }

  render() {
    console.log(this.state.rooms)
    return (
      <div className="App">
      <Rooms rooms = {this.state.rooms}/>
      </div>
    );
  }
}

export default App;
