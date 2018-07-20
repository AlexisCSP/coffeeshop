$(function() {
  const socket = io('/rooms', {transports: ['websocket'], upgrade: false});

  socket.on('connect', () => {
    console.log('client connected, joining room...');
    socket.emit('join room', room_id);
  });

  socket.on('user joined room', (data) => {
    console.log("client joined room...");
    $('#num-users').text(data.length);
    data.forEach((client) => {
      console.log(`appending ${client}...`);
      $('#connected-users').append( $(`<p#${client}>${client}</p>`))
    })
  });

  socket.on('user left room', (data) => {
    console.log("client left room...");
    $('#num-users').text(data.length);
    data.forEach((client) => {
      console.log(`removing ${client}...`);
      let el = $('#connected-users').find( $(`#${client}`))
      if (!el) $(`#${client}`).remove();
    })
  });
})