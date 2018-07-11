$(function() {
// const socket = io({transports: ['websocket'], upgrade: false});
// const socket = io('127.0.0.1:3000', {transports: ['websocket'], secure: true});
// const socket = io('127.0.0.1:3000');
const socket = io();
  
  socket.on('user joined room', (data) => {
      $('#num-users').text(data);
      console.log(data);
  })

  socket.on('user left room', (data) => {
      $('#num-users').text(data.numUsers);
  })
})