'use strict';

/**
 * @ngdoc service
 * @name twRealtime.indexService
 * @description
 * # indexService
 * Service in the twRealtime.
 */
angular.module('twRealtime')
  .service('indexService', function ($http) {

    var obj = {};

    // /minha-saude
    var cards = [];

    obj.getCards = function(callback) {
      $http.get('../../assets/cards.json')
        .success(function(data) {
          cards = data;
          console.log('Success getCards: ', cards);
          callback(data);
        }).error(function(error) {
          console.log('Error getCards: ', error);
        })
    };
    // ====

    return obj;
  });
