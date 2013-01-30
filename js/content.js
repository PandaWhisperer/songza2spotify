$(function() {

    function update(song) {
        chrome.extension.sendMessage({
            type: 'songChange',
            song: song
        });
    }

    function getCurrentSongInfo() {
        return {
            artist: $('#player .szi-roll-song .szi-info .szi-artist').text(),
            title:  $('#player .szi-roll-song .szi-info .szi-title').text()
        }
    }

    var song = getCurrentSongInfo();

    function pollSongInfo() {
        var currentSong = getCurrentSongInfo();

        if (currentSong.name != song.name || currentSong.artist != song.artist) {
            song = currentSong;
            update(song);
        }
    }

    // reqister our handler
    window.setInterval(pollSongInfo, 5000);
    // send first update
    update(song);
    
});
