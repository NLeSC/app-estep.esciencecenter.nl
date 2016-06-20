(function() {
  'use strict';

  function SelectorController($scope) {
    $scope.tab = 1;

    var myEl = angular.element( document.querySelector( '#inventory-button' ) );
    myEl.addClass('black');

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
      var c1 = 'white';
      var c2 = 'black';
      if ($scope.tab === 1){
        c1 = 'black';
        c2 = 'white';
      }
      var myEl = angular.element( document.querySelector( '#software-button' ) );
      myEl.removeClass(c2);
      myEl.addClass(c1);
      var myEl2 = angular.element( document.querySelector( '#projects-button' ) );
      myEl2.removeClass(c1);
      myEl2.addClass(c2);
      var myEl3 = angular.element( document.querySelector( '#people-button' ) );
      myEl3.removeClass(c1);
      myEl3.addClass(c2);
      var myEl4 = angular.element( document.querySelector( '#organizations-button' ) );
      myEl4.removeClass(c1);
      myEl4.addClass(c2);
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

  }
  angular.module('estepApp.selector').controller('SelectorController', SelectorController);
})();
