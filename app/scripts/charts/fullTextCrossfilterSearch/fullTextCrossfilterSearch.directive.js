(function() {
  'use strict';

  function fullTextCrossfilterSearchDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/fullTextCrossfilterSearch/fullTextCrossfilterSearch.directive.html',
      controller: 'FullTextCrossfilterSearchController',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.charts').directive('fullTextCrossfilterSearchDirective', fullTextCrossfilterSearchDirective);
})();
