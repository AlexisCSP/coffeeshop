import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import './NewRoomModal.css'

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
    fetch('http://localhost:3001/rooms/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.value,
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
      <Modal open={this.props.isModalOpen} onClose={this.props.onModalClose} center>
        <div className="form-style-6">
          <h1>Create a new room</h1>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Room Name" />
            <input type="submit" value="Create" />
          </form>
        </div>
      </Modal>
    )
  }
}

export default NewRoomModal;
