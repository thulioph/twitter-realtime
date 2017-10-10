(function() {
  "use strict";

  angular
    .module("twRealtime", [
      "ngAnimate",
      "ngResource",
      "ngRoute"
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .when("/", {
          templateUrl: "views/index.html",
          controller: "IndexCtrl",
          controllerAs: "index"
        })
        .otherwise({
          redirectTo: "/"
        });
    });
})();

