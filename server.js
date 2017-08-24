let express = require('express');

let app = express();

let port = process.env.PORT || 7070;

//STATIC WEB
app.use('/', express.static(__dirname));

app.listen(port);

var request = require('request');

var youtubedl = require('youtube-dl');

var fs = require('fs');

let lastfm = require('./server/last.fm');

let youtube = require('./server/youtube');

console.log('Server listening on: ' + port);