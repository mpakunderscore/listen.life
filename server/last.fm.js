const jsdom = require("jsdom");
const {JSDOM} = jsdom;

let req = require('request');
let request = require('sync-request');

let database = require('./database.js');


module.exports.tags = function () {

    return shuffle(tags);
};

module.exports.playlist = function (tags) {

    console.log(tags);

    return getTagsTracks(tags);
};

module.exports.video = function (track) {

    console.log(track);

    return getYoutubeTrack(track);
};

module.exports.getTrackTags = function (track) {

    let artist = 'artist=' + track.artist + '&';
    let title = 'track=' + track.title + '&';

    let requestUrl = url + getTrackTopTags_ + artist + title + key + format;

    req(requestUrl, function (error, response, body) {

        let trackTags = [];

        if (!error && response.statusCode == 200) {

            if (JSON.parse(body).toptags === undefined) {

                console.log('no tags')
                console.log(JSON.parse(body))

                return;
            }

            let tagsArray = JSON.parse(body).toptags.tag; // Show the HTML for the Google homepage.

            for (let i = 0; i < tagsArray.length; i++) {

                let title = tagsArray[i].name;
                let count = tagsArray[i].count;

                console.log(title + ' - ' + count);

                trackTags.push({title: title, count: count})
            }

            // console.log('getTrackTopTags_ ' + artist + ' - ' + track + ' from web')
            // localStorage.setItem(getTrackTopTags_ + artist + track, JSON.stringify(trackTags));

            // checkTrack(artistTitle, trackTrack, trackTags);

            track["tags"] = JSON.stringify(trackTags);

            database.updateTrack(track)

            return new Promise(resolve => {
                return track;
            });

        } else {

            console.log(error)
            console.log(response)
        }
    })
};

let url = 'https://ws.audioscrobbler.com/2.0/?';

let getTopTags_ = 'method=tag.getTopTags&';
let getTopTracks_ = 'method=tag.getTopTracks&limit=500&';
let getTrackTopTags_ = 'method=track.getTopTags&';

let key = 'api_key=d6de1272194e70b5f0f25834eba24155&';
let format = 'format=json';

let tags = [];
let tagTracks = {};

// let playlist = [];

function getTagsTracks(tags) {

    //TODO
    if (tags === undefined) {
        return "";
    }

    let storedTracks = tagTracks[tags[0]];
    let tracks = getTagTopTracks(tags[0]);

    tracks[0].url = getYoutubeTrack(tracks[0]);

    return tracks;
}

//get tags
function getTopTags() {

    // if (localStorage.getItem(getTopTags_) === null) {

    req(url + getTopTags_ + key + format, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            let tagsArray = JSON.parse(body).toptags.tag; // Show the HTML for the Google homepage.

            for (let i = 0; i < tagsArray.length; i++) {

                let title = tagsArray[i].name;
                title = title.charAt(0).toUpperCase() + title.slice(1);

                tags.push({title: title, select: false})
            }

            // localStorage.setItem(getTopTags_, JSON.stringify(tags));
            console.log('getTopTags_ from web')
            // console.log(tags)

            // fillTags();
            // tags
            //TODO DO JOB HERE

        } else {

            console.log(response.statusCode)
        }
    })
}

// getTopTags();

function getTracks() {

    // playlist = [];
    // $('#playlist').text('');

    for (let i = 0; i < selectedTags.length; i++) {

        getTagTopTracks(selectedTags[i])
    }
}

function getTagTopTracks(tagTitle) {

    let tag = 'tag=' + tagTitle + '&';

    let fullURLString = url + getTopTracks_ + tag + key + format;

    console.log(fullURLString)

    let res = request('GET', fullURLString);

    let body = JSON.parse(res.getBody('utf8'));

    let tracksArray = shuffle(body.tracks.track);

    tagTracks[tagTitle] = [];

    for (let i = 0; i < tracksArray.length; i++) {

        let title = tracksArray[i].name;
        let artist = tracksArray[i].artist.name;

        tagTracks[tagTitle].push({artist: artist, title: title});

        // getTags(artist, title);
    }

    return tracksArray;
}

function getTags(artist, track) {

    let artistTitle = artist;
    let trackTrack = track;

    // console.log('getTags: ' + artist + ' - ' + track)

    artist = 'artist=' + artist + '&';
    track = 'track=' + track + '&';

    request(url + getTrackTopTags_ + artist + track + key + format, function (error, response, body) {

        let trackTags = [];

        if (!error && response.statusCode == 200) {

            if (JSON.parse(body).toptags === undefined) {


                // localStorage.setItem(getTrackTopTags_ + artist + track, JSON.stringify(trackTags));
                return;
            }

            let tagsArray = JSON.parse(body).toptags.tag; // Show the HTML for the Google homepage.

            for (let i = 0; i < tagsArray.length; i++) {

                let title = tagsArray[i].name;
                let count = tagsArray[i].count;

                console.log(title + ' - ' + count);

                trackTags.push({title: title, count: count})
            }

            // console.log('getTrackTopTags_ ' + artist + ' - ' + track + ' from web')
            // localStorage.setItem(getTrackTopTags_ + artist + track, JSON.stringify(trackTags));

            // checkTrack(artistTitle, trackTrack, trackTags);

        } else {
            console.log(response.statusCode)
        }
    })
}

function getYoutubeTrack(track) {

    // console.log('/download link')

    if (!track)
        return '';

    let fullURLYoutubeTrack = 'https://www.youtube.com/results?search_query=' + track.artist.name + '+-+' + track.name;

    console.log(fullURLYoutubeTrack )

    let res = request('GET', encodeURI(fullURLYoutubeTrack));

    let body = res.getBody('utf8');

    // const $ = cheerio.load(res.getBody('utf8'))

    // let dom = stringToDom(body);

    const dom = new JSDOM(body);

    let link = dom.window.document.querySelector("#results .item-section a");

    if (link === null)
        return "";

    let href = link.getAttribute("href");

    console.log(href);

    // let href = $.find('#results').find('.item-section').find('a')[0].href;

    return href.split("=")[1];
}

function getYoutubeTrack2(track) {

    // console.log('/download link');

    req('https://www.youtube.com/results?search_query=' + track.artist + '+-+' + track.title, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            let href = $(body).find('#results').find('.item-section').find('a')[0].href;

            // console.log(href);

            // downloadMP4(track, 'https://www.youtube.com/watch?v=' + href.split('/watch?v=')[1]);

        } else {

            console.log(response.statusCode)
        }
    })
}

function shuffle(array) {

    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
