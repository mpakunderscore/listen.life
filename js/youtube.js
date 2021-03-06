// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: '320',
        width: '180',
        videoId: '',
        playerVars: {'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0},
        events: {
            // 'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

let playerTotalTime = 0;

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING) {

        playerTotalTime = player.getDuration();
        // setTimeout(stopVideo, 6000);
        // done = true;

        $("#circle").removeClass("active");
        $("#circle-big").removeClass("active");
    }

    if (event.data === 0) {
        nextVideo()
    }
}

function stopVideo() {
    player.stopVideo();
}

function pauseVideo() {
    player.pauseVideo();
    $("#play").text("play_arrow");
    $("#play").attr("onclick", "playVideo()")
}

function playVideo() {
    player.playVideo();
    $("#play").text("pause");
    $("#play").attr("onclick", "pauseVideo()")
}

function seek(event) {

    let to = event.clientX / $(window).width();

    to = to * playerTotalTime;

    console.log(to)

    player.seekTo(to, true);
}
