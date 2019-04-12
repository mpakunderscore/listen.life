let bias = 0;

//TODO
let limit = 14;

function buildPlaylist() {

    for (let i = 0; i < limit; i++) {
        $("#playlist").append("<div class='track' id='track" + i + "'></div>");
    }
}

buildPlaylist();

function fillPlaylist(playlist) {

    for (let i = 0; i < limit; i++) {

        // console.log(playlist[i])

        if (playlist[i])
            $("#track" + i).text(playlist[i].artist.name + " - " + playlist[i].name);
    }
}

function movePlaylist(forward) {

    if (forward) {

        bias++;

    } else {

        bias--;
    }

    if (bias < 0)
        bias = 0;

    for (let i = 0; i < limit; i++) {
        $("#track" + i).text(_playlist[i + bias].artist.name + " - " + _playlist[i + bias].name);
    }
}

function nextVideo() {

    console.log(_playlist[1]);

    $("#circle-big").addClass("active");

    $.get(
        "/video",
        {track: _playlist[1 + bias]},
        function(video) {

            // console.log(playlist[0].url)

            movePlaylist(true);

            _playlist[bias].video = video;

            player.loadVideoById(video, 0, "large");
        }
    );
}

function prevVideo() {

    console.log(_playlist[1]);

    $("#circle-big").addClass("active");

    movePlaylist(false);

    player.loadVideoById(_playlist[bias].video, 0, "large");


}
