$(function() {
  const socket = io('/rooms', {transports: ['websocket'], upgrade: false});

  socket.on('connect', () => {
    console.log('client connected, joining room...');
    socket.emit('join room', room_id);
  });

  // data is array of client IDs
  socket.on('user joined room', (data) => {
    console.log("client joined room...");
    $('#num-users').text(data.length);
    data.forEach((client) => {
      client = client.replace('/rooms#', '');
      if (!$(`#${client}`).length){
        $('#connected-users').append( $(`<p class='socketid' id=${client}>${client}</p>`))
      }
    })
  });

  // data is array of client IDs
  socket.on('user left room', (data) => {
    console.log("client left room...");
    $('#num-users').text(data.length);
    // data and DOM elements are not same order
    data.forEach((client) => {
      client = client.replace('/rooms#', '');
      $('.socketid').each( (i, obj) => {
        if (client == $(obj).attr('id')){
          $(obj).addClass('safe');
        }
      });
    })
    // second loop over initial check to do deletion
    $('.socketid').each( (i, obj) => {
      if (!($(obj).hasClass('safe'))){
        $(obj).remove();
        return;
      }
      $(obj).removeClass('safe');
    });
  });
})