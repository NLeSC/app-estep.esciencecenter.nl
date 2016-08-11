(function() {
  'use strict';

  function forceDirectedDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/forceDirected/forceDirected.directive.html',
      controller: 'ForceDirectedController',
      controllerAs: 'ctrl',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.charts').directive('forceDirectedDirective', forceDirectedDirective);
})();
