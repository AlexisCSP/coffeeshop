$(function() {
  const socket = io('/rooms', {transports: ['websocket'], upgrade: false});

  socket.on('connect', () => {
    console.log("connected");
    socket.emit('join room', room_id);
  })

  socket.on('user joined room', (data) => {
      console.log("room joined");
      $('#num-users').text(data.roomUsers);
  })

  socket.on('user left room', (data) => {
      console.log("left room");
      $('#num-users').text(data.roomUsers);
  })

})