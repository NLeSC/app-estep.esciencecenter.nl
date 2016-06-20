(function() {
  'use strict';

  function expertiseDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/expertise/expertise.directive.html',
      controller: 'ExpertiseController',
      controllerAs: 'expertiseCtrl'
    };
  }

  angular.module('estepApp.software').directive('expertiseDirective', expertiseDirective);
})();
