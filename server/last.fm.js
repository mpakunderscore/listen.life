// var $ = require("jquery");
// var stringToDom = require('string-to-dom');

// var stringToDom = require('string-to-dom');

// const cheerio = require('cheerio');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


module.exports = {

    tags: function () {

        return tags;

    },

    playlist: function (tags) {

        console.log(tags);

        return getPlaylist(tags);
    }
};

var req = require('request');

var request = require('sync-request');

var url = 'https://ws.audioscrobbler.com/2.0/?';

var getTopTags_ =       'method=tag.getTopTags&';
var getTopTracks_ =     'method=tag.getTopTracks&';
var getTrackTopTags_ =  'method=track.getTopTags&';

var key = 'api_key=d6de1272194e70b5f0f25834eba24155&';
var format = 'format=json';

let tags = [];
let tagTracks = {};

var playlist = [];

function getPlaylist(tags) {

    //TODO
    if (tags === undefined) {
        return "";
    }

    let storedTracks = tagTracks[tags[0]];
    let tracks = getTagTracks(tags[0]);

    tracks[0].url = getYoutubeTrack(tracks[0]);

    return tracks;
}

//get tags
function getTopTags() {

    // if (localStorage.getItem(getTopTags_) === null) {

    req(url + getTopTags_ + key + format, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var tagsArray = JSON.parse(body).toptags.tag; // Show the HTML for the Google homepage.

            for (var i = 0; i < tagsArray.length; i++) {

                var title = tagsArray[i].name;
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

// } else {

    // console.log('getTopTags_ from localStorage')
    // tags = JSON.parse(localStorage.getItem(getTopTags_))

    // fillTags();
// }

}

getTopTags();

function getTracks() {

    playlist = [];
    // $('#playlist').text('');

    for (var i = 0; i < selectedTags.length; i++) {

        getTagTracks(selectedTags[i])
    }
}

function getTagTracks(tagTitle) {

    var tag = 'tag=' + tagTitle + '&';

    let res = request('GET', url + getTopTracks_ + tag + key + format);

    let body = JSON.parse(res.getBody('utf8'));

    var tracksArray = body.tracks.track;

    tagTracks[tagTitle] = [];

    for (var i = 0; i < tracksArray.length; i++) {

        var title = tracksArray[i].name;
        var artist = tracksArray[i].artist.name;

        tagTracks[tagTitle].push({artist: artist, title: title});

        // getTags(artist, title);
    }

    return tagTracks[tagTitle];
}

function getTags(artist, track) {

    var artistTitle = artist;
    var trackTrack = track;

    // console.log('getTags: ' + artist + ' - ' + track)

    artist = 'artist=' + artist + '&';
    track = 'track=' + track +'&';

    if (localStorage.getItem(getTrackTopTags_ + artist + track) === null) {

        // console.log(url + encodeURIComponent(getTrackTopTags_ + artist + track + key + format))

        request(url + getTrackTopTags_ + artist + track + key + format, function (error, response, body) {

            var trackTags = [];

            if (!error && response.statusCode == 200) {

                if (JSON.parse(body).toptags === undefined) {
                    localStorage.setItem(getTrackTopTags_ + artist + track, JSON.stringify(trackTags));
                    return;
                }

                var tagsArray = JSON.parse(body).toptags.tag; // Show the HTML for the Google homepage.

                for (var i = 0; i < tagsArray.length; i++) {

                    var title = tagsArray[i].name;
                    var count = tagsArray[i].count;

                    // console.log(title + ' - ' + count);
                    // name = name.charAt(0).toUpperCase() + name.slice(1);

                    trackTags.push({title: title, count: count})
                }

                // console.log('getTrackTopTags_ ' + artist + ' - ' + track + ' from web')
                localStorage.setItem(getTrackTopTags_ + artist + track, JSON.stringify(trackTags));

                checkTrack(artistTitle, trackTrack, trackTags);

            } else {
                console.log(response.statusCode)
            }
        })

    } else {

        var trackTags = JSON.parse(localStorage.getItem(getTrackTopTags_ + artist + track))

        checkTrack(artistTitle, trackTrack, trackTags);
    }
}

function getYoutubeTrack(track) {

    // console.log('/download link')



    var res = request('GET', 'https://www.youtube.com/results?search_query=' + track.artist + '+-+' + track.title);

    let body = res.getBody('utf8');

    // const $ = cheerio.load(res.getBody('utf8'))

    // let dom = stringToDom(body);

    const dom = new JSDOM(body);

    let href = dom.window.document.querySelector("#results .item-section a").getAttribute("href");

    console.log(href);

    // var href = $.find('#results').find('.item-section').find('a')[0].href;

    return href.split("=")[1];
}

function getYoutubeTrack2(track) {

    // console.log('/download link');

    req('https://www.youtube.com/results?search_query=' + track.artist + '+-+' + track.title, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var href = $(body).find('#results').find('.item-section').find('a')[0].href;

            // console.log(href);

            // downloadMP4(track, 'https://www.youtube.com/watch?v=' + href.split('/watch?v=')[1]);

        } else {

            console.log(response.statusCode)
        }
    })
}