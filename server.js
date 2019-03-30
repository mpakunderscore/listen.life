
// var youtubedl = require('youtube-dl');

// var fs = require('fs');

require('dotenv').config()

let lastfm = require('./server/last.fm');

let youtube = require('./server/youtube');

// let database = require('./server/database');

let express = require('express');

let app = express();

let api = require('./server/api')(app);

let port = process.env.PORT || 7070;

//STATIC WEB
app.use('/', express.static(__dirname));

app.get('/api', function (requst, response) {
    response.sendfile('api.html');
});

app.listen(port);

// database.buildTracks();

console.log('server listening on: ' + port);


