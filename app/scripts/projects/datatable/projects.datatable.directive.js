(function() {
  'use strict';

  function projectsDatatableDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/projects/datatable/projects.datatable.directive.html',
      controller: 'ProjectsDatatableController',
      controllerAs: 'projDTc'
    };
  }

  angular.module('estepApp.projects').directive('projectsDatatableDirective', projectsDatatableDirective);
})();
