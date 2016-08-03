(function() {
  'use strict';

  function projectsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/projects.directive.html',
      controller: 'ProjectsController',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.projects').directive('projectsDirective', projectsDirective);
})();
