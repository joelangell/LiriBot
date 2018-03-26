require("dotenv").config();

//variables
var command = process.argv[2]
var input = process.argv[3]
var keys = require('./keys.js')
var Twitter = require('twitter')
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});
var Spotify = require('node-spotify-api')
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var omdbApi = require('omdb-client')
var omdbKey = keys.omdb.id


//twitter function
function twitter() {

    var params = { screen_name: 'ScoopKasperov', tweet_mode: 'extended' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++)
                console.log("Tweet #" + (parseInt(i)+1) + " : " + tweets[i].full_text, '\n' + "Tweet Date/Time: " + tweets[i].created_at)
        }
    })
}

//spotify function -note: I haven't defaulted to "Ace of Base" because I'd really rather not
function spotifyThis(x) {

    if (x === undefined) {
        trackName = 'Where We Trip the Light'
    } else {
        trackName = x
    }

    spotify.search({ type: 'track', query: trackName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err)
        }

        console.log("Artist: " + data.tracks.items[0].artists[0].name)
        console.log("Track Name: " + data.tracks.items[0].name)
        console.log("Preview Link: " + data.tracks.items[0].preview_url)
        console.log("Album Name: " + data.tracks.items[0].album.name)
    });
}

//OMDB Search function - note: I've defaulted to Gladiator since it is awesome and Mr. Nobody isn't
function movieSearch(x) {
    // var omdbApi = require('omdb-client')

    if (x === undefined) {
        movieTitle = 'Gladiator'
    } else {
        movieTitle = x
    }

    var params = {
        apiKey: omdbKey,
        title: "" + movieTitle + ""
    }
   
    omdbApi.get(params, function (err, data) {
        console.log("Movie Title: " + data.Title)
        console.log("Year: " + data.Year)
        console.log("iMDB Rating: " + data.Ratings[0].Value)
        console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value)
        console.log("Language: " + data.Language)
        console.log("Country: " + data.Country)
        console.log("Plot: " + data.Plot)
        console.log("Actors: " + data.Actors)
    });
}

//if else function taking in user commands
if (command === 'my-tweets') {
    twitter()
} else if (command === 'spotify-this-song') {
    spotifyThis(input)
} else if (command === 'movie-this') {
    movieSearch(input)
} else if (command === 'do-what-it-says') {
    var fs = require('fs')

    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        }

        var read = data.split(" ")
        var readInput = read[0]
        var read2 = data.split(/"/)
        var readInput2 = '"' + read2[1] + '"'
        if (readInput === 'spotify-this-song') {
            spotifyThis(readInput2)
        } else if (readInput === 'movie-this') {
            movieSearch(readInput2)
        } else if (readInput === 'twitter') {
            twitter()
        }
    })
}
