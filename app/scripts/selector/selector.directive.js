(function() {
  'use strict';

  function rigSelector() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/selector/selector.directive.html',
      controller: 'SelectorController',
      controllerAs: '$ctrl',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.selector').directive('rigSelector', rigSelector);
})();
