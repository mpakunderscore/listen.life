fillTags();

function circle() {

    $.get(
        "/playlist",
        {tags: selectedTags},
        function(playlist) {
            console.log(playlist[0].url)
            player.loadVideoById(playlist[0].url, 0, "large");
        }
    );
}