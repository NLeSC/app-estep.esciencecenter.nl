(function() {
  'use strict';

  function GenericArrayBasedRowChart($element, $attrs, d3, dc, NdxService, ChartsRegistryService, NdxHelperFunctions, estepConf) {
    var ctrl = this;
    var ndxInstanceName = $attrs.ndxServiceName;
    var maxRows = Number($attrs.maxRows);
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.jsonArrayFieldToChart = $attrs.jsonArrayFieldToChart;

    var rowChart = dc.rowChart($element[0].children[1], ndxInstanceName);

    var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxInstanceName, ctrl.jsonArrayFieldToChart);
    var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, ctrl.jsonArrayFieldToChart);

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
      .filterHandler(NdxHelperFunctions.bagFilterHandler(rowChart))
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
    ChartsRegistryService.registerChart(ndxInstanceName, ctrl.jsonArrayFieldToChart, rowChart);
  }

  angular.module('estepApp.charts').controller('GenericArrayBasedRowChart', GenericArrayBasedRowChart);
})();
