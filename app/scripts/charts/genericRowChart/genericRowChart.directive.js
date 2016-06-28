(function() {
  'use strict';

  function genericRowChartDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/charts/genericRowChart/genericRowChart.directive.html',
      controller: 'GenericRowChart',
      controllerAs: 'gRCCtrl',
      scope: true,
      link: function(scope, element, attributes, ctrl) {
        ctrl.linkedInit(element, attributes.ndxServiceName, attributes.chartHeader, attributes.jsonArrayFieldToChart, attributes.maxRows);
      }
    };
  }

  angular.module('estepApp.charts').directive('genericRowChartDirective', genericRowChartDirective);
})();
