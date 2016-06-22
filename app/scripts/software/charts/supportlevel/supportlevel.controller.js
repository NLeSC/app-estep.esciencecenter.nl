(function() {
  'use strict';

  function SupportLevelController($element, d3, dc, SoftwareNdxService, NdxHelperFunctions) {

    this.initializeChart = function() {
      var rowChart = dc.rowChart('#rowchart_supportLevel');

      var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(SoftwareNdxService, 'supportLevel');
      var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, 'supportLevel');

      var chartwidth = parseInt($element[0].getClientRects()[0].width, 10);
      var barheight = 25;
      var gapheight = 1;
      var margin = 0;

      function chartheight(nvalues) {
        return (nvalues-1) * gapheight + (barheight * nvalues) + margin;
      }

      rowChart
        .width(chartwidth)
        .height(chartheight(group.top(Infinity).length))
        .fixedBarHeight(barheight)
        .dimension(dimension)
        .group(group)
        .data(function(d) {
          return d.top(50);
        })
        .filterHandler(NdxHelperFunctions.bagFilterHandler(rowChart))
        .elasticX(true)
        .gap(1)
        .margins({top:0,bottom:-1,right:0,left:0})
        // .colors(d3.scale.ordinal().range(deterministicShuffle(colorbrewer.Set3[12],2)))
        .xAxis().tickFormat(d3.format('d')).ticks(1);

        // if (programmingLanguageFilter) {
        //   programmingLanguageChart.filter(programmingLanguageFilter);
        // }
        // programmingLanguageChart.ordering(function(d){ return -d.value });
        //

      rowChart.render();
    };

    SoftwareNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.software').controller('SupportLevelController', SupportLevelController);
})();
