$(function() {
  const socket = io('/rooms', {transports: ['websocket'], upgrade: false});
  
  socket.on('user joined room', (data) => {
      $('#num-users').text(data.roomUsers);
  })

  socket.on('user left room', (data) => {
      $('#num-users').text(data.roomUsers);
  })
})