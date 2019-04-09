let lastfm = require('./last.fm');

let database = require('./database');

module.exports.scan = function () {

    console.log(lastfm);

    let lastfmTracks = lastfm.playlist(["Electronic"]);

    let tracks = {};

    for (let i = 0; i < lastfmTracks.length; i++) {

        if (lastfmTracks[i].mbid !== "" && !tracks.hasOwnProperty(lastfmTracks[i].mbid)) {

            // lastfm.tags();

            database.models.Track.create({
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
