import React, { Component } from 'react';
import './App.css';
import Rooms from './components/Rooms'
import NewRoomModal from './components/NewRoomModal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import cookie from 'react-cookies'

library.add(faThumbsUp)
library.add(faThumbsDown)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms : [],
      isLoggedIn : false,
      isModalOpen : false};
  }

  onOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isModalOpen: false });
    this.getRoomsData()
  };

  componentDidMount() {
    this.getRoomsData()
  }

  getRoomsData() {
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
    this.setState({isLoggedIn : cookie.load('access_token') ? true : false})
  }

  render() {
    return (
      <div className="App">
        <Rooms rooms = {this.state.rooms} isLoggedIn = {this.state.isLoggedIn} openModal = {this.onOpenModal}/>
        <NewRoomModal isModalOpen={this.state.isModalOpen} onModalClose={this.onCloseModal}/>
      </div>
    );
  }
}

export default App;
