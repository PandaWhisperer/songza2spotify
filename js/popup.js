
function searchSpotify(query, callback) {
    // encode query properly
    query = encodeURIComponent(query.toLowerCase());

    $.getJSON("http://ws.spotify.com/search/1/track.json?q="+query, callback);
}

function getAlbumCover(albumURI, callback) {
    $.get(makeSpotifyLink(albumURI), function(response, status) {
        var match = response.match(/meta.*og:image.*content="(.*)"/);
        if (match && match.length > 1) {
            return callback(match[1]);
        }
        // request error or no image found
        return callback(null);
    });
}

function makeSpotifyLink(uri) {
    var base = 'http://open.spotify.com/';

    if (uri && uri.split) {
        var parts = uri.split(':');

        if (parts.length === 3 && parts[0] === 'spotify') {
            return base + parts[1] + '/' + parts[2];
        }
    }

    return null;
}

function showResults(data, status) {
    $('.content').removeClass('loading');

    if (status === 'success') {
        for (var i = 0; i < data.tracks.length; i++) {
            var track = data.tracks[i];

            track.url = makeSpotifyLink(track.href);
            track.album.url = makeSpotifyLink(track.album.href);

            track.artist = track.artists[0];
            track.artist.url = makeSpotifyLink(track.artist.href);

            $('.content').append(
                // format using template
                ich.track(track)
            );

            getAlbumCover(track.album.href, function(coverURL) {
                $('.track[id="' + track.href + '"] .album img').removeClass('loading').attr('src', coverURL);
            });
        }
    } else {
        $('.content').text('Could not connect to Spotify.');
    }
}

// initialize popup content
$(function () {
    var background_page = chrome.extension.getBackgroundPage();

    var artist = $('#artist', background_page.document).text();
    var title  = $('#title',  background_page.document).text();

    if (artist && title) {
        searchSpotify(artist + ' ' + title, showResults);
    }
});
