(function() {
  "use strict";

  function TwitterService() {
    var socket = io.connect();
    var obj = {};
    var feeds = [];

    obj.getFeeds = function(callback) {
      socket.on('stream', function(tweetJSON){
        feeds = tweetJSON;
        callback(tweetJSON);
      });
    };

    return obj;
  }

  angular
    .module("twRealtime")
    .service("TwitterService", TwitterService);
})();
