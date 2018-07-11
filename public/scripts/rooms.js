window.onload = function() {
// const socket = io({transports: ['websocket'], upgrade: false});
// const socket = io('127.0.0.1:3000', {transports: ['websocket'], secure: true});
// const socket = io('127.0.0.1:3000');
  const socket = io();
  const roomID = $('#id').val();
  console.log('javascript called');
  socket.emit('join', roomID);

  socket.on('user joined', (data) => {
      $('#num-users').text(data);
      window.localStorage.setItem('numUsers', data);
      console.log('data: '+data);
  });

  socket.on('user left', (data) => {
      $('#num-users').text(data);
      console.log('user left, '+data+' users remain');
  });
};