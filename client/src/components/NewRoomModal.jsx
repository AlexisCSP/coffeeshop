import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import './NewRoomModal.css'
import cookie from 'react-cookies'

class NewRoomModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var latitude = 49.2790657;
    var longitude = -122.9206087;
    if (this.props.coords !== null) {
      latitude = this.props.coords.latitude;
      longitude = this.props.coords.longitude;
    }
    fetch('http://localhost:3001/rooms/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.value,
        latitude: latitude,
        longitude: longitude,
        spotify_id: cookie.load('spotify_id')
      })
    })
    .then(res => res.json())
    .then(() => this.props.onModalClose())
    .catch(error => {
         // handle error
    });
    event.preventDefault();
  }

  render() {
    return (
      <Modal className="background-secondary-dark" open={this.props.isModalOpen} onClose={this.props.onModalClose} center>
        <div className="form-style-6 background-secondary-main">
          <h1 className="background-secondary-dark color-secondary-text">Create a new room</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="background-secondary-light color-secondary-text" type="text" value={this.state.value} onChange={this.handleChange} placeholder="Room Name" />
            <input className="background-secondary-dark color-secondary-text" type="submit" value="Create" />
          </form>
        </div>
      </Modal>
    )
  }
}

export default NewRoomModal;
