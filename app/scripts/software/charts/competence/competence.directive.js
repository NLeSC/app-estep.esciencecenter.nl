(function() {
  'use strict';

  function competenceDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/competence/competence.directive.html',
      controller: 'CompetenceController',
      controllerAs: 'competenceCtrl'
    };
  }

  angular.module('estepApp.software').directive('competenceDirective', competenceDirective);
})();
