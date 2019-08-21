
require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var command = process.argv[2]
var search = process.argv[3]


switch (command) {
    case "concert-this":
        bandsInTown(search);
        break;
    case "spotify-this-song":
        spotifyThis(search);
        break;
    case "movie-this":
        movieThis(search);
        break;
    case "do-what-it-says":
        randomChoice();
        break;
}

function bandsInTown(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (response) {
            if (response.data[0].venue != undefined) {
                console.log("----------------")
                console.log("Event Venue: " + response.data[0].venue.name);
                console.log("Event location: " + response.data[0].venue.city);
                var eventDateTime = moment(response.data[0].datetime);
                console.log("Event Date & Time: " + eventDateTime.format("dddd, MMMM Do YYYY"));
                console.log("-----------------")
            }
            else {
                console.log("We found no results.");
            }
        }
    ).catch(function (error) {
        console.log(error);
    });
}

function movieThis(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy").then(
        function (response) {
            if (response.data.Title != undefined) {
                console.log("----------------");
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("imdbRating: " + response.data.imdbRating);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("RottenTomatoes: " + response.data.tomatoRating);
                console.log("----------------");
            }
            else {
                movieThis("Mr. Nobody");
            }
        }
    ).catch(function (error) {
        console.log(error);
        console.log("We found no results.");
    });
}

function spotifyThis(song) {
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            if (response.tracks.total === 0) {
                spotifyError();
            } else {
                console.log("----------------")
                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Track: " + response.tracks.items[0].name);
                console.log("Preview URL: " + response.tracks.items[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);
                console.log("-----------------");
            }
        }).catch(function (error) {
            console.log(error);
            console.log("No results found. Showing results for 'The Sign' by Ace of Base");
        });
}

function spotifyError() {
    spotify
        .search({ type: "track", query: "The Sign" })
        .then(function (response) {
            for (var i = 0; i < response.tracks.items.length; i++) {
                if (response.tracks.items[i].artists[0].name === "Ace of Base") {
                    console.log("---------------")
                    console.log("Artist: " + response.tracks.items[i].artists[0].name);
                    console.log("Track: " + response.tracks.items[i].name);
                    console.log("Preview URL: " + response.tracks.items[i].preview_url);
                    console.log("Album: " + response.tracks.items[i].album.name);
                    i = response.tracks.items.length;
                    console.log("----------------");
                }
            }
        }).catch(function (error) {
            console.log(error);
            console.log("We found no results.");
        });
}

function randomChoice() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        spotifyThis(dataArr[1])
        if (error) {
            return console.log(error);
        }
    });
}