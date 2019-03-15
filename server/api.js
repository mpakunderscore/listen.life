let database = require('./database');

module.exports = function (app) {

    app.get('/tags', function (request, response) {
        response.json(database.tags());
    });

    app.get('/playlist', function (request, response) {
        response.json(lastfm.playlist(request.query.tags));
    });

    app.get('/video', function (request, response) {
        response.json(lastfm.video(request.query.track));
    });

    app.get('/scan', function (request, response) {
        database.scan();
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

