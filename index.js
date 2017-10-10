// Imports
var express = require("express");
var app = require("express")();
var http = require("http").Server(app);
var Twit = require("twit");
var io = require("socket.io")(http);

// Server
http.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// Twitter
var watchList = [
  "#pybr13"
];

var T = new Twit({
  consumer_key: "z4ebhQjySYZcu5aIHUqKgPJiZ",
  consumer_secret: "4kVt3glKRLd9dLHIKSi578s4aoZUfmyTwvfonIoXsajOpVWkzF",
  access_token: "365489318-9syC9NODIhM5vAalAGTrz9W9THf8ToZ2Jmh6baty",
  access_token_secret: "OrGLZBFCgSjPqSdbU1LTsSsbKGfszRGyytEfJ9iVmo3q7"
});


// Socket
io.sockets.on('connection', function(socket) {
  var stream = T.stream('statuses/filter', { track: watchList });

  stream.on('tweet', function(tweet) {
    var tweetJSON = {
      text: tweet.text,
      name: tweet.user.screen_name,
      image: tweet.user.profile_image_url
    };

    // if tweet has location
    if(tweet.place) {
      tweetJSON.endereco = tweet.place.full_name + ', ' + tweet.place.country;
    }

    io.sockets.emit('stream', tweetJSON);
  });
});