const socket = io('/rooms', {transports: ['websocket'], upgrade: false});

$(function() {
  http://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
  };

  // register this socket this socket
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

  // data is array of candidate OBJs
  socket.on('update room queue', (data) => {
    $('#queue').empty();
    if (data){
      data.forEach( (obj) => {
        $('#queue').append(`<li>
                              <button id='${obj.id}' class='queue-item'>
                                <img id='album-image' src='${obj.album_image}' style='height: 30px'/>
                                <span id='song'> ${obj.song} - </span> 
                                <span id='artist'> ${obj.artist} from </span> 
                                <span id='album-name'> ${obj.album_name} </span>
                              </button>
                              <input id='${obj.id}' class='vote-count' type='text' readonly value='${obj.votes}'/>
                              <button  id='${obj.id}' class='vote-up'>+</button>
                              <button  id='${obj.id}' class='vote-down'>-</button>
                            </li>`);
      })
    }
  });

  // data is array of candidate OBJs
  socket.on('update vote count', (data) => {
    data.forEach( (obj) => {
      $(`input#${obj.id}`).attr('value', obj.votes);
    })
  });
  
  // Real-time debounced search - makes async calls to Spotify API via /spotify/search
  $('#song-search').on('keyup', debounce(function(){
    let container = $('#search-results-container');
    container.empty();
    
    let data = encodeURIComponent($('#song-search').val());
    let url = `http://localhost:3001/spotify/search/${data}`;
    
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: url,
      success: (data) => {
        // No results
        if (!data.length){
          container.append('<p>no results</p>');
        }
        else{
          data.forEach( (obj) => {
            container.append(`<button id='${obj.id}' class='potential-suggestion'>
            <img id='album-image' src='${obj.album_image}' style='height: 30px'/>
            <span id='song'> ${obj.song}</span>  - 
            <span id='artist'> ${obj.artist}</span>  from 
            <span id='album-name'> ${obj.album_name} </span>
            <a id='url' href='${obj.url}'> Link </a>
            <input id='uri' type='hidden' value='${obj.uri}'/>
            </button>`);
          })
        }
      }
    })
  }, 175));
  
  // Temp event listener that send selected song suggestion to queue 
  // and emits across sockets
  $(document).on('click', '.potential-suggestion', (e) => {
    // Temp DOM maintenence for testing
    $('#song-search').blur();
    $('#song-search').val('');
    $('#search-results-container').empty();
    
    // Construct candidate JS object and emit
    let candidate = {}
    candidate.id = e.target.closest('button.potential-suggestion').id;
    candidate.uri = $(e.currentTarget).children('input#uri').val();
    candidate.song = $(e.currentTarget).children('span#song').text();
    candidate.artist = $(e.currentTarget).children('span#artist').text();
    candidate.album_name = $(e.currentTarget).children('span#album-name').text();
    candidate.album_image = $(e.currentTarget).children('img#album-image').attr('src');
    candidate.votes = 0;

    console.log(`Suggesting: ${JSON.stringify(candidate)}`);

    socket.emit('song suggested', candidate);
  })

  // Temp event listener that listens for vote up
  // and emits across sockets
  $(document).on('click', '.vote-up', (e) => {
    // Construct candidate JS object and emit
    let candidate = {}
    candidate.id = e.target.id;

    socket.emit('user voted up', candidate);
  })

  // Temp event listener that listens for vote down
  // and emits across sockets
  $(document).on('click', '.vote-down', (e) => {
    // Construct candidate JS object and emit
    let candidate = {}
    candidate.id = e.target.id;

    socket.emit('user voted down', candidate);
  })
})