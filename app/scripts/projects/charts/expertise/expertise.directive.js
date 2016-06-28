(function() {
  'use strict';

  function projectsExpertiseDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/charts/expertise/expertise.directive.html',
      controller: 'ProjectsExpertiseController',
      controllerAs: 'projectsExpertiseCtrl'
    };
  }

  angular.module('estepApp.projects').directive('projectsExpertiseDirective', projectsExpertiseDirective);
})();
