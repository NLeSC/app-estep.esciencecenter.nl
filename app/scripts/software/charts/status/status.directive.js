(function() {
  'use strict';

  function statusDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/status/status.directive.html',
      controller: 'StatusController',
      controllerAs: 'statusCtrl'
    };
  }

  angular.module('estepApp.software').directive('statusDirective', statusDirective);
})();
