fillTags();

let delay = 200;

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

    $("#player").css("display", "block");

    player.loadVideoById(playlist[0].url, 0, "large");

    $("#progress").addClass("show");

    $("#track1").text(playlist[1].artist + " - " + playlist[1].title);
    $("#track").text(playlist[0].artist + " - " + playlist[0].title);

    let timer = setInterval(function() {

        var playerCurrentTime = player.getCurrentTime();

        // console.log(playerTotalTime + "/" + playerCurrentTime)

        var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;

        // console.log(playerTimeDifference)

        $("#done").css("width", playerTimeDifference + "%");

    }, 1000);
}