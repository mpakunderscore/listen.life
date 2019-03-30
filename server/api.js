let database = require('./database');

let lastfm = require('./last.fm');

let core = require('./core');

module.exports = function (app) {

    app.get('/tags', function (request, response) {
        response.json(database.tags());
    });

    app.get('/tags/get', function (request, response) {
        // response.json(database.tags());
    });

    app.get('/tracks', function (request, response) {
        response.json(database.tracks());
    });

    app.get('/tracks/get', function (request, response) {
        response.json(database.getAllTracks());
    });

    app.get('/tracks/build', function (request, response) {
        response.json(database.buildTracks());
    });

    app.get('/playlist', function (request, response) {
        response.json(lastfm.playlist(request.query.tags));
    });

    app.get('/video', function (request, response) {
        response.json(lastfm.video(request.query.track));
    });

    app.get('/scan', function (request, response) {
        core.scan();
        response.json(true);
    });

    app.get('/expand', function (request, response) {
        database.expand();
        response.json(true);
    });

    app.get('/buildTags', function (request, response) {
        database.buildTags();
        response.json(true);
    });

    app.get('/tracks', function (request, response) {
        response.json(database.tracks());
    });
};

