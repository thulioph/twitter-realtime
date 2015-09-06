'use strict';

/**
 * @ngdoc function
 * @name twRealtime.controller:IndexCtrl
* @description
 * # IndexCtrl
 * Controller of the twRealtime
 */
angular.module('twRealtime')
  .controller('IndexCtrl', ['$scope',  function ($scope) {

    $scope.projectName = 'Twitter + Socket.io + Leaflet API ⚡️';
    $scope.description = 'Open-source real-time tweets with your location';

    var map, socket, markers, marker;

    $scope.geolocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.mapLeaFlet, $scope.errorGeolocation);
      } else {
        alert('not supported');
      }
    };

    $scope.mapLeaFlet = function(position) {
      var lat = position.coords.latitude,
          lng = position.coords.longitude;

      map = L.map('map').setView([lat, lng], 13);

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
    };

    $scope.geolocation();

    $scope.errorGeolocation = function(msg) {
      alert('Error, geolocation: ', msg);
    };

    $scope.updateMap = function(text, lat, lng) {
      markers = new L.LayerGroup().addTo(map);
      marker = L.marker([lat, lng]).addTo(markers).bindPopup(text).openPopup();;
    };

    socket = io.connect();

    socket.on('stream', function(tweetJSON){
      var data = tweetJSON,
          text = data.text,
          name = data.name, 
          image = data.image,
          lat = data.lat, 
          lng = data.lng;

        $scope.updateMap(text, lat, lng);
    });

  }]);
