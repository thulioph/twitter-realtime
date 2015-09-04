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

    $scope.projectName = 'Twitter + Socket.io + Google Maps API ⚡️';

    var socket, geocoder, 
        myLatlng, mapOptions, infowindow, map, 
        marcadorPersonalizado, styles, styledMap, notification, options;

    $scope.geolocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showMap, $scope.errorGeolocation);
      } else {
        console.log('not supported');
      }
    };

    $scope.showMap = function(position) {
      myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      mapOptions = {
        zoom: 11,
        center: myLatlng,
        panControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_jsdaybr']
        }
      }

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      marcadorPersonalizado = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-32.png',
        title: 'Você está aqui!'
      });

      infowindow = new google.maps.InfoWindow({
        content: 'Você está aqui!',
        maxWidth: 700
      });

      infowindow.open(map, marcadorPersonalizado);

      // Estilizando o mapa;
      styles = [
        {
          stylers: [
            { hue: "#ffff00" },
            { "invert_lightness": true },
            { "weight": 0.3 },
            { saturation: -73 },
            { lightness: 0 },
            { gamma: 0 }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "on" }
          ]
        },
        {
          featureType: "road",
          elementType: "labels"
        }
      ];

      styledMap = new google.maps.StyledMapType(styles, {
        name: "Map JSDay BR"
      });

      // Aplicando as configurações do mapa
      map.mapTypes.set('map_jsdaybr', styledMap);
      map.setMapTypeId('map_jsdaybr');

      geocoder = new google.maps.Geocoder();
    };

    $scope.errorGeolocation = function(msg) {
      console.log('Error, geolocation: ', msg);
    };

    // pega a localização do usuário e mostra no mapa
    $scope.geolocation();

    $scope.showMapTweet = function(text, name, image, endereco) {

      geocoder.geocode({'address': endereco}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          console.log('latlng: ', results[0].geometry.location.G, results[0].geometry.location.K);

            marcadorPersonalizado = new google.maps.Marker({
              position: new google.maps.LatLng(results[0].geometry.location.G, results[0].geometry.location.K),
              map: map,
              icon: image
            });

            marcadorPersonalizado.setMap(map);

            infowindow = new google.maps.InfoWindow({
              content: text,
              maxWidth: 700
            });

            infowindow.open(map, marcadorPersonalizado);

        } else {
          alert('Geocoder falhou por conta de: ' + status);
        }
      });

      $scope.openNofify(name, text, image);
      $scope.showTweet(name, text, image);
    };

    $scope.openNofify = function(title, body, icon) {
      options = {
        body: body,
        icon: icon
      };

      if (!("Notification" in window)) {
        console.log('Seu navegador não suporta notificações.');
      } else if (Notification.permission === 'granted') {
        notification = new Notification(title, options);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          if (permission === 'granted') {
            notification = new Notification(title, options);
          }
        });
      }
    };

    $scope.showTweet = function(name, text, image) {
      var tweetsArray, meuObjeto;

      meuObjeto = {'name': name, 'text': text, 'image': image};
      
      tweetsArray = [];
      tweetsArray.push(meuObjeto);

      console.log('tweetsArray ', tweetsArray);
      console.log('tweetsArray.length ', tweetsArray.length);
    };

    socket = io.connect();

    socket.on('stream', function(tweetJSON){
      var data = tweetJSON,
          text = data.text,
          name = data.name, 
          image = data.image,
          endereco = data.endereco;

        $scope.showMapTweet(text, name, image, endereco);
    });

  }]);
