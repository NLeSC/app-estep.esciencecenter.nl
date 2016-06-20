(function() {
  'use strict';

  function projectsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/projects.directive.html',
      controller: 'ProjectsController',
      controllerAs: 'vprojc'
    };
  }

  angular.module('estepApp.projects').directive('projectsDirective', projectsDirective);
})();
