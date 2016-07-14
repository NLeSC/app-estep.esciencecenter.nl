(function() {
  'use strict';

  function CounterController($element, $attrs, $state, dc, NdxService) {
    var ctrl = this;
    this.collection = $attrs.ndxServiceName;

    this.initChart = function() {
      var dimension = NdxService.getNdxInstance(ctrl.collection);
      var group = dimension.groupAll();
      var dataCounter = dc.dataCount($element[0].children[0], ctrl.collection)
        .dimension(dimension)
        .group(group)
      ;
      dataCounter.render();
    };

    this.resetAll = function() {
      dc.filterAll(ctrl.collection);
      dc.renderAll(ctrl.collection);
      $state.go(ctrl.collection, {}, {inherit: false, notify: false});
    };

    this.initChart();
  }

  angular.module('estepApp.charts').component('counterChart', {
    controller: CounterController,
    templateUrl: 'scripts/charts/counterChart/counterChart.directive.html'
  });
})();
