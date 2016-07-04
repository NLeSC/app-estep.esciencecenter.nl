(function() {
  'use strict';

  function peopleDatatableDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/people/datatable/people.datatable.directive.html',
      controller: 'PeopleDatatableController',
      controllerAs: 'peopleDTc'
    };
  }

  angular.module('estepApp.people').directive('peopleDatatableDirective', peopleDatatableDirective);
})();
