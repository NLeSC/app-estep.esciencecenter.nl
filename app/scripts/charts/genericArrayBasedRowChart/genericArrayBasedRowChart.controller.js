(function() {
  'use strict';

  function GenericArrayBasedRowChart($scope, $element, d3, dc, NdxService, ChartsRegistryService, NdxHelperFunctions, estepConf) {

    this.initializeChart = function(element, ndxInstanceName, chartHeader, jsonArrayFieldToChart, maxRows) {
      var ctrl = this;
      ctrl.chartHeader = chartHeader;
      ctrl.jsonArrayFieldToChart = jsonArrayFieldToChart;

      var rowChart = dc.rowChart(element[0].children[1]);

      var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxInstanceName, ctrl.jsonArrayFieldToChart);
      var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, ctrl.jsonArrayFieldToChart);

      function chartheight(nvalues) {
        return (nvalues-1) * estepConf.ROWCHART_DIMENSIONS.gapHeight +
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
    };

    this.linkedInit = function(element, ndxInstanceName, chartHeader, jsonArrayFieldToChart, maxRows) {
      NdxService.ready.then(function() {
        this.initializeChart(element, ndxInstanceName, chartHeader, jsonArrayFieldToChart, maxRows);
      }.bind(this));
    };
  }

  angular.module('estepApp.charts').controller('GenericArrayBasedRowChart', GenericArrayBasedRowChart);
})();
