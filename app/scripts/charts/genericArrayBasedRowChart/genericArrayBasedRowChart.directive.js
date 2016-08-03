(function() {
  'use strict';

  function genericArrayBasedRowChartDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/genericArrayBasedRowChart/genericArrayBasedRowChart.directive.html',
      controller: 'GenericArrayBasedRowChart',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.charts').directive('genericArrayBasedRowChartDirective', genericArrayBasedRowChartDirective);
})();
