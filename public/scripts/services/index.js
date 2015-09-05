'use strict';

/**
 * @ngdoc service
 * @name twRealtime.twitterService
 * @description
 * # twitterService
 * Service in the twRealtime.
 */
angular.module('twRealtime')
  .service('TwitterService', [function ($scope, socket) {

    var socket = io.connect();
    var obj = {};
    var feeds = [];

    obj.getFeeds = function(callback) {

      socket.on('stream', function(tweetJSON){
        feeds = tweetJSON;
        callback(tweetJSON)
      });
      
    };

    return obj;
  }]);