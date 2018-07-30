import React, { Component } from 'react';
import './App.css';
import Rooms from './components/Rooms'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

library.add(faThumbsUp)
library.add(faThumbsDown)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms : [],
      isLoggedIn : false };
  }

  componentDidMount() {
     fetch('/rooms', {
       method: 'GET',
       headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
       }
     })
     .then(res => res.json())
     .then(rooms => this.setState({ rooms : rooms }))
     .catch(error => {
          // handle error
     });
  }

  render() {
    return (
      <div className="App">
      <Rooms rooms = {this.state.rooms} isLoggedIn = {this.state.isLoggedIn}/>
      </div>
    );
  }
}

export default App;
