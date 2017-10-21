
// var youtubedl = require('youtube-dl');

// var fs = require('fs');

let lastfm = require('./server/last.fm');

let youtube = require('./server/youtube');

let api = require('./server/api');


let express = require('express');

let app = express();

let port = process.env.PORT || 7070;

//STATIC WEB
app.use('/', express.static(__dirname));

app.listen(port);

var request = require('request');



app.get('/tags', function (request, response) {
    response.json(lastfm.tags());
});

app.get('/playlist', function (request, response) {
    response.json(lastfm.playlist(request.query.tags));
});

app.get('/video', function (request, response) {
    response.json(lastfm.video(request.query.track));
});

console.log('Server listening on: ' + port);