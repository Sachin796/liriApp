var axios = require("axios");
var moment = require("moment");
var dotenv = require("dotenv");
var spotifyAPI = require("node-spotify-api");
var fs = require("fs");

var dotenvconfig = require("dotenv").config();
var keys = require("./keys.js");
var spotify = new spotifyAPI(keys.spotify);

//Accepting User Data
var strData = process.argv.slice(2, 3).join("");
switch (strData) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    {
      var choice;
      var todo;
      fs.readFile(`./random.txt`, "UTF8", function(err, data) {
        if (err) {
          console.log(`Error occured ${err}`);
        } else {
          todo = data.substring(0, data.indexOf(","));
          choice = JSON.parse(data.substring(data.indexOf(",") + 1));
          if (todo === "spotify-this-song") spotifyThisSong(choice);
          else if (todo === "concert-this") concertThis(choice);
          else if (todo === "movie-this") movieThis(choice);
        }
      });
    }
    break;
}

function spotifyThisSong(newData) {
  var data;
  if (newData === undefined) {
    data = process.argv.slice(3).join("");
  } else if (newData !== undefined) {
    data = newData;
  }
  spotify.search(
    {
      type: "track",
      query: data
    },
    function(err, result) {
      if (err) {
        console.log(`Error occured ${err}`);
        return;
      } else {
        console.log(result.tracks.items[0].album.artists);
        console.log(result.tracks.items[0].album.name);
      }
    }
  );
}

function concertThis(newData) {
  var data;
  if (newData === undefined) {
    data = process.argv.slice(3).join("");
  } else if (newData !== undefined) {
    data = newData;
  }
  const URL = `https://rest.bandsintown.com/artists/${data}/events?app_id=codingbootcamp`;
  axios.get(URL).then(result => {
    let res = result.data[0];
    // console.log(res);
    console.log(
      `The venue name is :- ${res.venue.name} \n the country of the venue is ${res.venue.country} \n and the date is  ${res.dateTime}`
    );
  });
}

function movieThis(newData) {
  var data;
  if (newData === undefined) {
    data = process.argv.slice(3).join(" ");
  } else if (newData !== undefined) data = newData;

  const URL = `http://www.omdbapi.com/?t=${data}&apikey=trilogy`;
  axios.get(URL).then(result => {
    console.log(result);
  });
}
