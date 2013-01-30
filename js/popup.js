function searchSpotify(query, callback) {
    var request = new XMLHttpRequest();

    // encode query properly
    query = encodeURIComponent(query.toLowerCase());

    // populate request
    request.open("GET", "http://ws.spotify.com/search/1/track.json?q="+query, true);
    request.onreadystatechange = function(event) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                callback({
                    success: true,
                    data: JSON.parse(request.responseText)
                });
            } else {
                callback({success: false});
            }
        }
    }

    // and... fire
    request.send();
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

function showResults(result) {
    var tracks = result.data.tracks;

    $('.content').removeClass('loading');

    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];

        $('.content').append(
            '<div>' +
                '<a href="' + makeSpotifyLink(track.href) + '" target="_blank">' +
                    '<span class="artist">' +
                         track.artists.map(function(artist) { return artist.name; }).join(', ') +
                    '</span> - ' +
                    '<span class="title">' + track.name + '</span>' +
                '</a>' +
            '</div>'
        );
    }
}

$(function () {
    var background_page = chrome.extension.getBackgroundPage();

    var artist = $('#artist', background_page.document).text();
    var title  = $('#title',  background_page.document).text();

    if (artist && title) {
        searchSpotify(artist + ' ' + title, showResults);
    }
});
