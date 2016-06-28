(function() {
  'use strict';

  function genericArrayBasedRowChartDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/genericArrayBasedRowChart/genericArrayBasedRowChart.directive.html',
      controller: 'GenericArrayBasedRowChart',
      controllerAs: 'gABRCCtrl',
      scope: true,
      link: function(scope, element, attributes, ctrl) {
        ctrl.linkedInit(element, attributes.ndxServiceName, attributes.chartHeader, attributes.jsonArrayFieldToChart, attributes.maxRows);
      }
    };
  }

  angular.module('estepApp.charts').directive('genericArrayBasedRowChartDirective', genericArrayBasedRowChartDirective);
})();
