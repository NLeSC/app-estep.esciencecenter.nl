(function() {
  'use strict';

  function fullTextCrossfilterSearchDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/fullTextCrossfilterSearch/fullTextCrossfilterSearch.directive.html',
      controller: 'FullTextCrossfilterSearchController',
      controllerAs: 'fTCSCtrl',
      scope: true,
      link: function(scope, element, attributes, ctrl) {
        ctrl.linkedInit(element, attributes.ndxServiceName, attributes.jsonFields, attributes.chartHeader);
      }
    };
  }

  angular.module('estepApp.charts').directive('fullTextCrossfilterSearchDirective', fullTextCrossfilterSearchDirective);
})();
