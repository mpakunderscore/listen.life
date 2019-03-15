
// var youtubedl = require('youtube-dl');

// var fs = require('fs');

let lastfm = require('./server/last.fm');

let youtube = require('./server/youtube');

let database = require('./server/database');

let express = require('express');

let app = express();

let api = require('./server/api')(app);

let port = process.env.PORT || 7070;

//STATIC WEB
app.use('/', express.static(__dirname));

app.listen(port);

database.buildTracks();

console.log('Server listening on: ' + port);


