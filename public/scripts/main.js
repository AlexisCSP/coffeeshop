$(function() {
    var socket = io({transports: ['websocket'], upgrade: false});

    socket.on('user joined', (data) => {
        $('#numUsers').text(data.numUsers);
    })

    socket.on('user left', (data) => {
        $('#numUsers').text(data.numUsers);
    })
});