(function() {
  'use strict';

  function projectsDataMagnitudeDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/charts/datamagnitude/datamagnitude.directive.html',
      controller: 'ProjectsDataMagnitudeController',
      controllerAs: 'projectsDataMagnitudeCtrl'
    };
  }

  angular.module('estepApp.projects').directive('projectsDataMagnitudeDirective', projectsDataMagnitudeDirective);
})();
