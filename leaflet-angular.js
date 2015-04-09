(function(angular){

  'use strict';

var app = angular.module('app.directives.leaflet', []);

app.directive('leaflet', [function () { return {

  restrict: 'E',

  scope: {
    view     : '=',
    popups   : '=',
    markers  : '=',
    circles  : '=',
    polygons : '=',
  },

  controller: ['$scope', function ($scope) {

    $scope.initialized = false;

    var mapCache = {
      view: [],
      markers: [],
      popups: [],
      circles: [],
      polygons: [],
    };


    // Initialization
    ////////////////////////////////////////////////////////

    $scope.init = function(){
      $scope.map = L.map($scope.view.id);
      L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      ).addTo($scope.map);
      $scope.initialized = true;
      $scope.setAll($scope);
      $scope.setupWatchers();
    };

    setTimeout($scope.init, 0);

    $scope.setAll = function($_){
      $_.view     && $_.setView     ($_.view);
      $_.markers  && $_.addMarkers  ($_.markers);
      $_.popups   && $_.addPopups   ($_.popups);
      $_.polygons && $_.addPolygons ($_.polygons);
      $_.circles  && $_.addCircles  ($_.circles);
    };


    // Leaflet Interface
    ////////////////////////////////////////////////////////

    $scope.clear = function(thing){
      var cache = mapCache[thing];
      cache.length && cache.forEach(function(thing){
        $scope.map.removeLayer(thing);
      });
      mapCache[thing] = [];
    };

    $scope.setView = function(view){
      $scope.map.setView([view.lat, view.lng], view.zoom);;
      if (view.fitBounds) $scope.fitBounds($scope.markers);
    };

    $scope.fitBounds = function(markers){
      var padding = $scope.view.padding || 0;
      $scope.map.fitBounds(markers, {
          padding: [padding, padding]
        }
      );
    };

    $scope.addMarkers = function(markers){
      markers && markers.forEach(function(marker){
        var M = L.marker([marker.lat, marker.lng]);
        if (marker.popup)
          mapCache.markers.push(M.bindPopup(marker.popup));
        M.addTo($scope.map);
        if (marker.openPopup) M.openPopup();
      });
    };

    $scope.addPopups = function(popups){
      popups.forEach(function(popup){
        var P = L.popup();
        mapCache.popups.push(P);
        P.setLatLng([popup.lat, popup.lng]);
        P.setContent(popup.content);
        if (popup.openPopup) P.openOn($scope.map);
      });
    };

    $scope.addPolygons = function(polygons){
      polygons.forEach(function(polygon){
        var P = L.polygon( polygon.shape, polygon.style || {})
          .addTo($scope.map);
        mapCache.polygons.push(P);
        if (polygon.popup) {
          P.bindPopup(polygon.popup.content);
          if (polygon.popup.openPopup) P.openPopup();
        }
      });
    };

    $scope.addCircles = function(circles){
      circles.forEach(function(circle){
        var C = L.circle([circle.lat, circle.lng],
          circle.radius, circle.style || {})
          .addTo($scope.map);
        if (circle.popup) {
          C.bindPopup(circle.popup.content);
          if (circle.popup.openPopup) C.openPopup();
        }
        mapCache.circles.push(C);
      });
    };


    // Setup Watchers
    ////////////////////////////////////////////////////////

    $scope.setupWatchers = function(){
      $scope.$watch('markers', function(n){
        $scope.clear('markers');
        $scope.markers && $scope.addMarkers(n);
      });

      $scope.$watch('view', function(n, o){
        var view = angular.extend({}, o, n);
        $scope.setView(view);
        return view;
      });

      $scope.$watch('popups', function(n, o){
        $scope.clear('popups');
        $scope.popups && $scope.addPopups(n);
      });

      $scope.$watch('polygons', function(n, o){
        $scope.clear('polygons');
        $scope.polygons && $scope.addPolygons(n);
      });

      $scope.$watch('circles', function(n, o){
        $scope.clear('circles');
        $scope.circles && $scope.addCircles(n);
      });
    };

  }],

  // Map Template
  ////////////////////////////////////////////////////////

  template: '<div id="{{view.id}}" style="height:{{view.height}}px;width:{{view.width}}px;"></div>'

}}]);


}(angular));