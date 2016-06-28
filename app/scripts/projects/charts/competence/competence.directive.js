(function() {
  'use strict';

  function projectsCompetenceDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/charts/competence/competence.directive.html',
      controller: 'ProjectsCompetenceController',
      controllerAs: 'projectsCompetenceCtrl'
    };
  }

  angular.module('estepApp.projects').directive('projectsCompetenceDirective', projectsCompetenceDirective);
})();
