import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

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
    fetch('/rooms/create', {
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
    .catch(error => {
         // handle error
    });
    event.preventDefault();
  }

  render() {
    return (
      <Modal open={this.props.isModalOpen} onClose={this.props.onModalClose} center>
          <h2>Create a new room</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Group Title :
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
      </Modal>
    )
  }
}

export default NewRoomModal;
