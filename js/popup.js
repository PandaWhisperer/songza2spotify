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

function showResults(result) {
    var tracks = result.data.tracks;

    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i],
            track_div = document.createElement('div'),
            artist    = document.createElement('span'),
            title     = document.createElement('span');

        artist.id = 'artist';
        artist.innerText = track.artists.map(function(artist) { return artist.name; }).join(', ');

        title.id = 'title';
        title.innerText  = track.title;
        
        track_div.appendChild(artist);
        track_div.appendChild(title);

        document.body.appendChild(track_div);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var background_page = chrome.extension.getBackgroundPage();

    var artist = background_page.document.getElementById('artist').innerText;
    var title  = background_page.document.getElementById('title').innerText;

    document.getElementById('artist').innerText = artist;
    document.getElementById('title').innerText  = title;

    if (artist && title) {
        //searchSpotify(artist + ' ' + title, showResults);
    }
});
