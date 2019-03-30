let Sequelize = require('sequelize');

// let network = require('./network.js');

let lastfm = require('./last.fm.js');

let sequelize = new Sequelize(process.env.DATABASE_URL);

let models = exports.models = {};

models.Track = sequelize.define('track', {
    mbid: {type: Sequelize.STRING, primaryKey: true},
    title: Sequelize.STRING,
    artist: Sequelize.STRING,
    tags: Sequelize.TEXT,
    length: Sequelize.INTEGER,
    youtube: Sequelize.STRING,
});

models.Artist = sequelize.define('artist', {
    mbid: {type: Sequelize.STRING, primaryKey: true},
    title: Sequelize.STRING,
    wiki: Sequelize.STRING,
});

models.Album = sequelize.define('album', {
    title: Sequelize.STRING,
});

models.Tag = sequelize.define('tag', {
    title: Sequelize.STRING,
    wiki: Sequelize.TEXT,
});

let drop = false;
if (drop) {
    models.Track.sync({force: true}).then(() => {});
    models.Artist.sync({force: true}).then(() => {});
    models.Album.sync({force: true}).then(() => {});
    models.Tag.sync({force: true}).then(() => {});
}

let tags = {};

let tracks = {};

exports.tracks = function () {
    return tracks;
};

exports.tags = function () {
    return tags;
};

//buildTracks tracks array
exports.buildTracks = function () {

    exports.models.Track.findAll().then(dbTracks => {

        dbTracks.forEach((track) => {

            let plainTrack = track.get({
                plain: true
            });

            tracks[plainTrack.mbid] = plainTrack;
        });

        console.log("buildTracks db: " + tracks);

        //fill tags to track object
        buildTags();
    });
};

let buildTags = function () {

    // let tracks = this.tracks();

    let globalTags = {};

    for (let mbid in tracks) {

        // console.log(tracks.length + " " + i);

        let track = tracks[mbid];

        lastfm.getTrackTags(track).then((value) => {

            console.log(value)

            let tags = JSON.parse(track.tags);

            // console.log(tags.length);

            for (let i = 0; i < tags.length; i++) {

                let title = tags[i].title;


                title = title.charAt(0).toUpperCase() + title.slice(1);

                if (globalTags.hasOwnProperty(title)) {

                    globalTags[title] = globalTags[title] + 1;

                } else {

                    globalTags[title] = 1;
                }
            }
        });


    }

    // let result = Object.keys(globalTags).map(function(key) {
    //     return [Number(key), globalTags[key]];
    // });

    let sortable = [];
    for (let gTag in globalTags) {
        sortable.push({title: gTag, count: globalTags[gTag], active: false});
    }

    sortable.sort(function(a, b) {
        return b["count"] - a["count"];
    });

    tags = sortable;

    console.log("buildTags db: " + Object.keys(tags).length);
};

//update tracks data from last.fm

exports.updateTrack = function (track) {

    exports.models.Track.update({ tags: track.tags }, { where: { mbid: track.mbid } }).then((result) => {

        console.log(result)

        tracks[track.mbid] = track;

        // console.log("tracks updated: " + Object.keys(track.tags).length);
    }).catch(error => {
        console.log(error);
    });
};

//load all tracks in storage

exports.getAllTracks = function () {

    exports.models.Track.findAll().then(dbTracks => {

        dbTracks.forEach((track) => {

            let plainTrack = track.get({
                plain: true
            });

            tracks[plainTrack.mbid] = plainTrack;
        });

        // console.log(Object.keys(tracks).length)
    });
};



// console.log("buildTags db");

// exports.buildTags();

console.log("run db");
