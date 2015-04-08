//   // create a map in the "map" div, set the view to a given place and zoom
//   var map = L.map('map').setView([51.505, -0.09], 13);

//   // add an OpenStreetMap tile layer
//   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

//   // add a marker in the given location, attach some popup content to it and open the popup
//   L.marker([51.5, -0.09]).addTo(map)
//       .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
//       .openPopup();

// }]);


(function(){

var app = angular.module('app.directives.leaflet', []);

app.directive('leaflet', [function () {
  return {
    restrict: 'E',
    scope: {
      view: '=',
      popups: '=',
      markers: '=',
      circles: '=',
    },
    controller: ['$scope', function ($scope) {
      
      $scope.init = function(){
        
        // Initialization
        $scope.map = L.map($scope.view.id);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
          .addTo($scope.map);
        
        // View
        $scope.view && $scope.map.setView([
          $scope.view.lat,
          $scope.view.lng
        ], $scope.view.zoom);

        // Markers
        $scope.markers && $scope.markers.forEach(function(marker){
          var LMarker = L.marker([marker.lat, marker.lng]);
          
          if (marker.popup)
            LMarker.bindPopup(marker.popup);

          LMarker.addTo($scope.map);

          if (marker.openPopup)
            LMarker.openPopup();
        });

        // Standalone Popups
        $scope.popups && $scope.popups.forEach(function(popup){
          var LPopup = L.popup();
          
          LPopup.setLatLng([popup.lat, popup.lng]);

          LPopup.setContent(popup.content);

          if (popup.openPopup)
            LPopup.openOn($scope.map);              
        });

        // Circles
        $scope.circles && $scope.circles.forEach(function(circle){
      
          var LCircle = L.circle([circle.lat, circle.lng],
            circle.radius,
            circle.style).addTo($scope.map);
        });
      }

      setTimeout($scope.init, 0);
    }],
    template: '<div id="{{view.id}}" style="height:{{view.height}}px;width:{{view.width}}px;"></div>'
  };
}]);







// app.constant('config', {
//   map: {
//     id: 'map',
//     height: 400,
//     center: {
//       lat: 51.505,
//       lng: -0.09,
//       zoom: 13
//     }
//   }
// });


// app.controller('LeafletCtrl', ['$scope', 'config',

// function($scope, config) {
//   angular.extend($scope, config);
//   console.log(config);

//   $scope.init = function(){
//     $scope.map.leaflet = L.map($scope.map.id);
//     L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo($scope.map.leaflet);
//     $scope.setView();
//   }

//   setTimeout($scope.init, 0);

//   $scope.setView = function() {
//     return $scope.map.leaflet.setView([
//       $scope.map.center.lat,
//       $scope.map.center.lng
//     ], $scope.map.center.zoom);
//   }
  

//   console.log($scope.map);

// }]);



}());