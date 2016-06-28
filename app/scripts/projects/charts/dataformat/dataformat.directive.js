(function() {
  'use strict';

  function projectsDataFormatDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/charts/dataformat/dataformat.directive.html',
      controller: 'ProjectsDataFormatController',
      controllerAs: 'projectsDataformatCtrl'
    };
  }

  angular.module('estepApp.projects').directive('projectsDataFormatDirective', projectsDataFormatDirective);
})();
