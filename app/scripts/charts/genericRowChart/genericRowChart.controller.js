(function() {
  'use strict';

  function GenericRowChart($element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions, estepConf) {
    var ctrl = this;
    var ndxInstanceName = ctrl.ndxInstanceName = $attrs.ndxServiceName;
    var maxRows = Number($attrs.maxRows);
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.jsonArrayFieldToChart = $attrs.jsonArrayFieldToChart;

    var rowChart = dc.rowChart($element[0].children[1], ndxInstanceName);

    var dimension = NdxHelperFunctions.buildDimensionWithProperty(ndxInstanceName, ctrl.jsonArrayFieldToChart);
    var group = NdxHelperFunctions.buildGroupWithProperty(dimension, ctrl.jsonArrayFieldToChart);

    function chartheight(nvalues) {
      return (nvalues - 1) * estepConf.ROWCHART_DIMENSIONS.gapHeight +
        (estepConf.ROWCHART_DIMENSIONS.barHeight * nvalues) +
        estepConf.ROWCHART_DIMENSIONS.margins.top;
    }

    var chartElements = Math.max(1, Math.min(group.top(Infinity).length, maxRows));

    rowChart
      .width(estepConf.ROWCHART_DIMENSIONS.width)
      .height(chartheight(chartElements))
      .fixedBarHeight(estepConf.ROWCHART_DIMENSIONS.barHeight)
      .dimension(dimension)
      .group(group)
      .data(function(d) {
        return d.top(chartElements);
      })
      .filterHandler(function(dimension, filters) {
          var result = NdxHelperFunctions.bagFilterHandler(rowChart, ctrl.chartHeader)(dimension, filters);
          var params = {};
          params[ctrl.jsonArrayFieldToChart] = filters;
          $state.go(ctrl.ndxInstanceName, params, {notify: false});
          return result;
      }.bind(this))
      .elasticX(true)
      .gap(estepConf.ROWCHART_DIMENSIONS.gapHeight)
      .margins(estepConf.ROWCHART_DIMENSIONS.margins)
      // .colors(d3.scale.ordinal().range(deterministicShuffle(colorbrewer.Set3[12],2)))
      .xAxis().ticks(0);

    rowChart.on('preRedraw', function(chart) {
      var newChartElements = Math.max(1, Math.min(chart.group().top(Infinity).length, maxRows));

      var newHeight = chartheight(newChartElements);
      if (chart.height() !== newHeight) {
        chart.height(newHeight);
        chart.render();
      }

      chart.data(function(d) {
        return d.top(newChartElements);
      });
    });
    rowChart.render();
    NdxHelperFunctions.applyState(rowChart, ndxInstanceName, ctrl.jsonArrayFieldToChart, ctrl.chartHeader);
  }

  angular.module('estepApp.charts').controller('GenericRowChart', GenericRowChart);
})();
