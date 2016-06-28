(function() {
  'use strict';

  function projectsDisciplineDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/charts/discipline/discipline.directive.html',
      controller: 'ProjectsDisciplineController',
      controllerAs: 'projectsDisciplineCtrl'
    };
  }

  angular.module('estepApp.projects').directive('projectsDisciplineDirective', projectsDisciplineDirective);
})();
