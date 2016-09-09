(function() {
  'use strict';

  function CounterController($element, $attrs, $state, dc, NdxService) {
    var ctrl = this;
    this.ndxServiceName = $attrs.ndxServiceName;

    this.initChart = function() {
      var dimension = NdxService.getNdxInstance(ctrl.ndxServiceName);
      var group = dimension.groupAll();
      var dataCounter = dc.dataCount($element[0].children[0], ctrl.ndxServiceName)
        .dimension(dimension)
        .group(group)
      ;
      dataCounter.render();
    };

    this.resetAll = function() {
      dc.filterAll(ctrl.ndxServiceName);
      dc.redrawAll(ctrl.ndxServiceName);
      $state.go(ctrl.ndxServiceName, {}, {inherit: false, notify: false});
    };

    this.initChart();
  }

  angular.module('estepApp.charts').component('counterChart', {
    controller: CounterController,
    templateUrl: 'scripts/charts/counterChart/counterChart.directive.html'
  });
})();
