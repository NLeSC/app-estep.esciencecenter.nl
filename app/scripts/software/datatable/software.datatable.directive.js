(function() {
  'use strict';

  function softwareDatatableDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/datatable/software.datatable.directive.html',
      controller: 'SoftwareDatatableController',
      controllerAs: 'vsoftc'
    };
  }

  angular.module('estepApp.software').directive('softwareDatatableDirective', softwareDatatableDirective);
})();
