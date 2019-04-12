let database = require('./database');

let lastfm = require('./last.fm');

let core = require('./core');

module.exports = function (app) {


    app.get('/tracks', function (request, response) {
        response.json(database.tracks());
    });

    app.get('/tags', function (request, response) {
        response.json(database.tags());
    });

    // app.get('/tags/all', function (request, response) {
    //     response.json(database.tagsAll());
    // });

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

    app.get('/tags/build', function (request, response) {
        database.buildTags();
        response.json(true);
    });
};

