(function() {
  'use strict';

  function EndorsedbyController($scope, $element, d3, dc, SoftwareNdxService, NdxHelperFunctions, Messagebus) {

    this.onClick = function(key) {
      if (key === 'All') {
        this.dimension.filterAll();
      } else {
        var filters = [key];
        this.dimension.filterFunction(function(d) {
          var result = true;
          filters.forEach(function(f) {
            if (result === true && d.indexOf(f) === -1) {
              result = false;
            }
          });
          return result;
        });
      }

      // this.dimension.filter(key);
      dc.redrawAll();
    };

    this.initializeChart = function() {
      // var rowChart = dc.rowChart('#endorsedby_toggler');

      this.dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(SoftwareNdxService, 'inGroup');
      this.group = NdxHelperFunctions.buildGroupWithArrayProperty(this.dimension, 'inGroup');

      this.endorsers = this.group.top(Infinity);
      this.endorsers.push({
        key: 'All',
        value: 0
      });

      Messagebus.subscribe('newFilterEvent', function(event, chart, filters, dimension) {
        $scope.$evalAsync(function() {
          this.endorsers = this.group.top(Infinity);
          this.endorsers.push({
            key: 'All',
            value: 0
          });
        }.bind(this));
      }.bind(this));


      // debugger

      //
      // var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, 'inGroup');
      //
      // var chartwidth = parseInt($element[0].getClientRects()[0].width, 10);
      // var barheight = 25;
      // var gapheight = 1;
      // var margin = 0;
      //
      // function chartheight(nvalues) {
      //   return (nvalues-1) * gapheight + (barheight * nvalues) + margin;
      // }
      //
      // rowChart
      //   .width(chartwidth)
      //   .height(chartheight(group.top(Infinity).length))
      //   .fixedBarHeight(barheight)
      //   .dimension(dimension)
      //   .group(group)
      //   .data(function(d) {
      //     return d.top(50);
      //   })
      //   .filterHandler(NdxHelperFunctions.bagFilterHandler(rowChart))
      //   .elasticX(true)
      //   .gap(1)
      //   .margins({top:0,bottom:-1,right:0,left:0})
      //   // .colors(d3.scale.ordinal().range(deterministicShuffle(colorbrewer.Set3[12],2)))
      //   .xAxis().tickFormat(d3.format('d')).ticks(1);
      //
      //   // if (programmingLanguageFilter) {
      //   //   programmingLanguageChart.filter(programmingLanguageFilter);
      //   // }
      //   // programmingLanguageChart.ordering(function(d){ return -d.value });
      //   //
      //
      // rowChart.render();
    };

    SoftwareNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.endorsedby').controller('EndorsedbyController', EndorsedbyController);
})();
