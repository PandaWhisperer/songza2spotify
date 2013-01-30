document.addEventListener('DOMContentLoaded', function() {

    function update(song) {
        chrome.extension.sendMessage({
            type: 'songChange',
            song: song
        });
    }

    function getCurrentSongInfo() {
        var $ = document.querySelector;

        return {
            artist: $('#player .szi-roll-song .szi-info .szi-artist').innerText,
            title:  $('#player .szi-roll-song .szi-info .szi-title').innerText
        }
    }

    var song = getCurrentSongInfo();

    function pollSongInfo() {
        var currentsong = getCurrentSongInfo();

        if (currentsong.name != song.name || currentsong.artist != song.artist) {
            song = currentSong;
            update(song);
        }
    }

    // reqister our handler
    window.setInterval(pollSongInfo, 5000);
    // send first update
    update(song);
});
