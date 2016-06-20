(function() {
  'use strict';

  function technologyDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/technology/technology.directive.html',
      controller: 'TechnologyController',
      controllerAs: 'technologyCtrl'
    };
  }

  angular.module('estepApp.software').directive('technologyDirective', technologyDirective);
})();
