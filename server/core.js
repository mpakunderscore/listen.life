
module.exports.scan = function () {

    console.log(lastfm);

    let lastfmTracks = lastfm.playlist(["Electronic"]);

    for (let i = 0; i < lastfmTracks.length; i++) {

        if (lastfmTracks[i].mbid !== "" && !tracks.hasOwnProperty(lastfmTracks[i].mbid)) {

            lastfm.tags();

            Track.create({
                mbid: lastfmTracks[i].mbid,
                title: lastfmTracks[i].name,
                artist: lastfmTracks[i].artist.name,
                tags: "",
                length: 0,
                youtube: "",
            });
        }

        // lastfmTracks[i].artist.duration,
    }
};

module.exports.expand = function () {

    // let tracks = this.tracks();

    for (let mbid in tracks) {

        // console.log(tracks.length + " " + i);

        let track = tracks[mbid];

        lastfm.getTrackTags(track);
    }
};
