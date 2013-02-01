
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

    if (uri.split) {
        var parts = uri.split(':');

        if (parts.length === 3 && parts[0] === 'spotify') {
            return base + parts[1] + '/' + parts[2];
        }
    }

    return null;
}

function formatTrack(track) {
    getAlbumCover(track.album.href, function(coverURL) {
        $('div[href="' + track.href + '"] .cover img').removeClass('loading').attr('src', coverURL);
    });

    return  '' +
    '<div class="track" href="' + track.href + '">' +
        '<p class="cover">' +
            '<a href="' + makeSpotifyLink(track.album.href) + '" target="_blank">' +
                '<img class="loading"/>' +
            '</a>' +
        '</p>' +
        '<p class="details">' +
            '<p class="artist">' +
                 track.artists.map(function(artist) { return artist.name; }).join(', ') +
            '</p>' +
            '<p class="title">' +
                '<a href="' + makeSpotifyLink(track.href) + '" target="_blank">' + track.name + '</a>' +
            '</p>' +
        '</p>' +
    '</div>';
}

function showResults(data, status) {
    $('.content').removeClass('loading');

    if (status === 'success') {
        for (var i = 0; i < data.tracks.length; i++) {
            $('.content').append(formatTrack(data.tracks[i]));
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
