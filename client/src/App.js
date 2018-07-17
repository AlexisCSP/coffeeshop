import React, { Component } from 'react';
import './App.css';

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
      <h1>Rooms</h1>
      <ul>
        {this.state.rooms.map(room =>
        <li key={room.id}>{room.title}</li>
      )}
      </ul>
      </div>
    );
  }
}

export default App;
