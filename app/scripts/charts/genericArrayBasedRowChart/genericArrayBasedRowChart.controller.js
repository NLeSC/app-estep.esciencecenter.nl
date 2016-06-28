(function() {
  'use strict';

  function GenericArrayBasedRowChart($scope, $element, d3, dc, NdxService, NdxHelperFunctions, estepConf) {

    this.initializeChart = function(element, ndxService, chartHeader, jsonArrayFieldToChart, maxRows) {
      var gABRCCtrl = this;
      gABRCCtrl.chartHeader = chartHeader;
      gABRCCtrl.jsonArrayFieldToChart = jsonArrayFieldToChart;

      var rowChart = dc.rowChart(element[0].children[1]);

      var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxService, gABRCCtrl.jsonArrayFieldToChart);
      var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, gABRCCtrl.jsonArrayFieldToChart);

      function chartheight(nvalues) {
        return (nvalues-1) * estepConf.ROWCHART_DIMENSIONS.gapHeight +
                            (estepConf.ROWCHART_DIMENSIONS.barHeight * nvalues) +
                             estepConf.ROWCHART_DIMENSIONS.margins.top;
      }

      var chartElements = Math.min(group.top(Infinity).length, maxRows);

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

        // if (programmingLanguageFilter) {
        //   programmingLanguageChart.filter(programmingLanguageFilter);
        // }
        // programmingLanguageChart.ordering(function(d){ return -d.value });
        //

      rowChart.render();
    };

    this.linkedInit = function(element, ndxServiceName, chartHeader, jsonArrayFieldToChart, maxRows) {
      var ndxService = NdxService.getNdxService(ndxServiceName);
      ndxService.ready.then(function() {
        this.initializeChart(element, ndxService, chartHeader, jsonArrayFieldToChart, maxRows);
      }.bind(this));
    };
  }

  angular.module('estepApp.charts').controller('GenericArrayBasedRowChart', GenericArrayBasedRowChart);
})();
