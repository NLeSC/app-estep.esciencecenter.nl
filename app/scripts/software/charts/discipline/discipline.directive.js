(function() {
  'use strict';

  function disciplineDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/discipline/discipline.directive.html',
      controller: 'DisciplineController',
      controllerAs: 'disciplineCtrl'
    };
  }

  angular.module('estepApp.software').directive('disciplineDirective', disciplineDirective);
})();
