(function() {
  'use strict';

  function GenericRowChart($scope, $element, d3, dc, SoftwareNdxService, NdxHelperFunctions, estepConf) {
    this.initializeChart = function(element, chartHeader, jsonArrayFieldToChart, maxRows) {
      var ctrl = this;
      ctrl.chartHeader = chartHeader;
      ctrl.jsonArrayFieldToChart = jsonArrayFieldToChart;

      var rowChart = dc.rowChart(element[0].children[1]);

      var dimension = NdxHelperFunctions.buildDimensionWithProperty(SoftwareNdxService, ctrl.jsonArrayFieldToChart);
      var group = NdxHelperFunctions.buildGroupWithProperty(dimension, ctrl.jsonArrayFieldToChart);

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
        .xAxis().tickFormat(d3.format('d')).ticks(1);

        // if (programmingLanguageFilter) {
        //   programmingLanguageChart.filter(programmingLanguageFilter);
        // }
        // programmingLanguageChart.ordering(function(d){ return -d.value });
        //

      rowChart.render();
    };

    this.linkedInit = function(element, chartHeader, jsonArrayFieldToChart, maxRows) {
      SoftwareNdxService.ready.then(function() {
        this.initializeChart(element, chartHeader, jsonArrayFieldToChart, maxRows);
      }.bind(this));
    };
  }

  angular.module('estepApp.software').controller('GenericRowChart', GenericRowChart);
})();
