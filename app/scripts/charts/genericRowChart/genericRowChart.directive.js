(function() {
  'use strict';

  function genericRowChartDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/genericRowChart/genericRowChart.directive.html',
      controller: 'GenericRowChart',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.charts').directive('genericRowChartDirective', genericRowChartDirective);
})();
