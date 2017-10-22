

function fillPlaylist(playlist) {



    for (let i = 0; i < 100; i++) {
        $("#track" + i).text(playlist[i].artist + " - " + playlist[i].title);
    }
}

