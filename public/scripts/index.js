$(function() {
    // const socket = io('http://localhost', {transports: ['websocket'], upgrade: false});
    var socket = io('//'+document.location.hostname+':'+document.location.port);
    
    /* Parses URL for Spotify access_token with regex */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    const params = getHashParams();
    let access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } 
    else if (access_token) {
        // render oauth info
        $('#oauth').innerHTML = "access_token: "+access_token+", refresh_token: "+refresh_token;
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {'Authorization': 'Bearer ' + access_token}
        })
        .success((response) => {
            $('#display_name').text(response.display_name);
            $('#user_id').text(response.id);
            $('#email').text(response.email);
            $('#external_urls_spotify').attr('href', response.external_urls.spotify);
            $('#external_urls_spotify').text(response.external_urls.spotify);
            $('#user_link_href').attr('href', response.href);
            $('#user_link_href').text(response.href);
            $('#images_0_url').attr('src', response.images[0].url);
            $('#country').text(response.country);

            $('#login').hide();
            $('#loggedin').show();
            }
        )
    }
    else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }
    
    $('#obtain-new-token').on('click', () => {
        $.ajax({
            url: '/spotify/refresh_token',
            data: {'refresh_token': refresh_token}
        })
        .done((data) => {
            access_token = data.access_token;
            $('#oauth').text('access_token: '+access_token+'\n refresh_token: '+refresh_token)
        });
    });

    socket.on('user joined', (data) => {
        $('#num-users').text(data.numUsers);
    })

    socket.on('user left', (data) => {
        $('#num-users').text(data.numUsers);
    })
})