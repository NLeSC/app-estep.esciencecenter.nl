(function() {
  'use strict';

  function genericForceDirectedDirective() {
    return {
      restrict: 'E',
      // replace: true,
      transclude: true,
      templateUrl: 'scripts/charts/forceDirected/generic.force.directive.html',
      controller: 'GenericForceDirectedController',
      controllerAs: 'ctrl',
      scope: {prefilteredOn: '='},
      bindToController: true
    };
  }

  angular.module('estepApp.charts').directive('genericForceDirectedDirective', genericForceDirectedDirective);
})();
