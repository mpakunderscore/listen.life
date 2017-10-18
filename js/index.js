fillTags();

let _playlist = [];

let delay = 200;

let bias = 0;

function circle() {

    if (selectedTags.length === 0) {

        let roll = Math.floor((Math.random() * 30) + 1);

        console.log(roll)

        for (let i = 0; i < roll; i++) {

            setTimeout(function(){

                next();

                //do what you need here
            }, i * delay);
        }

        // console.log($("#tag3").text());

        setTimeout(function(){

            select($("#tag3").text(), 3);

            playlist();

            //do what you need here
        }, roll * delay);

    } else {

        playlist();
    }
}

function playlist() {

    $.get(
        "/playlist",
        {tags: selectedTags},
        function(playlist) {

            // console.log(playlist[0].url)

            play(playlist);
        }
    );
}

function play(playlist) {

    _playlist = playlist;

    $("#player").css("display", "block");

    player.loadVideoById(playlist[0].url, 0, "large");

    $("#progress").addClass("show");

    for (let i = 0; i < 6; i++) {
        $("#track" + i).text(_playlist[i].artist + " - " + _playlist[i].title);
    }

    $("#controls").css("display", "block");

    console.log("PLAY");

    let timer = setInterval(function() {

        var playerCurrentTime = player.getCurrentTime();

        // console.log(playerTotalTime + "/" + playerCurrentTime)

        var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;

        // console.log(playerTimeDifference)

        $("#done").css("width", playerTimeDifference + "%");

    }, 1000);
}

function nextVideo() {

    console.log(_playlist[1]);

    $.get(
        "/video",
        {track: _playlist[1 + bias]},
        function(video) {

            // console.log(playlist[0].url)

            bias++;

            for (let i = 0; i < 6; i++) {
                $("#track" + i).text(_playlist[i+bias].artist + " - " + _playlist[i+bias].title);
            }

            player.loadVideoById(video, 0, "large");
        }
    );
}






function background() {

    if (!$("body").hasClass("experimental")) {

        $("body").addClass("experimental");
        $("#background").text("OFF");

    } else {

        $("body").removeClass("experimental");
        $("#background").text("ON");
    }
}