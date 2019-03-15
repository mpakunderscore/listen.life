

let Sequelize = require('sequelize');

// let network = require('./network.js');

let lastfm = require('./last.fm.js');

let set = {

    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
};

let sequelize = new Sequelize('listen', 'pavelkuzmin', '', set);
// let sequelize = new Sequelize(process.env.DATABASE_URL);

let Track = sequelize.define('track', {
    mbid: {type: Sequelize.STRING, primaryKey: true},
    title: Sequelize.STRING,
    artist: Sequelize.STRING,
    tags: Sequelize.TEXT,
    length: Sequelize.INTEGER,
    youtube: Sequelize.STRING,
});

let Artist = sequelize.define('artist', {
    mbid: {type: Sequelize.STRING, primaryKey: true},
    title: Sequelize.STRING,
    wiki: Sequelize.STRING,
});

let Album = sequelize.define('album', {
    title: Sequelize.STRING,
});

let Tag = sequelize.define('tag', {
    title: Sequelize.STRING,
    wiki: Sequelize.TEXT,
});

let drop = false;
if (drop) {
    Track.sync({force: true}).then(() => {});
    Artist.sync({force: true}).then(() => {});
    Album.sync({force: true}).then(() => {});
    Tag.sync({force: true}).then(() => {});
}




let tags = {};

let tracks = {};

module.exports.tracks = function () {
    return tracks;
};

module.exports.tags = function () {
    return tags;
};



//buildTracks tracks array
module.exports.buildTracks = function () {

    Track.findAll().then(dbTracks => {

        dbTracks.forEach((track) => {

            let plainTrack = track.get({
                plain: true
            });

            tracks[plainTrack.mbid] = plainTrack;
        });

        console.log("buildTracks db: " + Object.keys(tracks).length);

        buildTags();
    });
};

let buildTags = function () {

    // let tracks = this.tracks();

    let globalTags = {};

    for (let mbid in tracks) {

        // console.log(tracks.length + " " + i);

        let track = tracks[mbid];

        // lastfm.getTrackTags(track);

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
    }

    // let result = Object.keys(globalTags).map(function(key) {
    //     return [Number(key), globalTags[key]];
    // });

    var sortable = [];
    for (var vehicle in globalTags) {
        sortable.push({title: vehicle, count: globalTags[vehicle], active: false});
    }

    sortable.sort(function(a, b) {
        return b["count"] - a["count"];
    });

    tags = sortable;

    console.log("buildTags db: " + Object.keys(tags).length);
};



module.exports.updateTrack = function (track) {

    Track.update(track, { where: { mbid: track.mbid } }).then((result) => {

        tracks[track.mbid] = track;
    });
};



// console.log("buildTags db");

// exports.buildTags();

console.log("run db");