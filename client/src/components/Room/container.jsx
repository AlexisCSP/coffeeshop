import React, { Component } from 'react';
import { connect } from 'react-redux';
import Search from './Search'
import Song from './Song'
import Player from './Player'
import { connectToRoom, addCandidate, voteUp, voteDown, playSong } from './controller';

class Room extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.connectToRoom()
  }

  fetchRoomData() {
    fetch('http://localhost:3001/rooms/' + this.props.id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(roomData => this.setState({ roomData } ))
    .catch(error => {
         // handle error
    });
  }

  render() {
    return (
      <div id="content-wrapper">
        <Search onSearchItemClick={this.props.addCandidate}/>
        <ul>
          {this.props.songs.map(song => {
            console.log('!!!!!', song);
            return (
              <li key={song.id}>
                <Song song={song} 
                  onUpvoteClick={this.props.voteUp} 
                  onDownvoteClick={this.props.voteDown}
                />
              </li>
            )
          }
          )}
        </ul>
        {this.props.isLoggedIn && 
        <Player
            song={this.props.currentSong}
            onNext={this.props.playSong}
            hasNext={this.props.hasNext}
        />
        }
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    songs: state.room.songs,
    clients: state.room.clients,
    currentSong: state.room.currentSong,
    hasNext: state.room.hasNext
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  connectToRoom: () => {
    console.log('dispatching');
    connectToRoom(props.id);
  },
  addCandidate: (song) => {
    addCandidate(song)
  },
  voteUp: (songId) => {
    voteUp({
      id: songId
    })
  },
  voteDown: (songId) => {
    voteDown({
      id: songId
    })
  },
  playSong: () => {
    playSong();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
