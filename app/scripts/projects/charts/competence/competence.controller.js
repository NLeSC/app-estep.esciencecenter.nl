(function() {
  'use strict';

  function ProjectsCompetenceController($window, d3, dc, ProjectsNdxService, NdxHelperFunctions, estepConf) {

    this.initializeChart = function() {
      var rowChart = dc.rowChart('#rowchart_projects_competence');

      var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ProjectsNdxService, 'competence');
      var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, 'competence');

      function chartheight(nvalues) {
        return (nvalues-1) * estepConf.ROWCHART_DIMENSIONS.gapHeight +
                            (estepConf.ROWCHART_DIMENSIONS.barHeight * nvalues) +
                             estepConf.ROWCHART_DIMENSIONS.margins.top;
      }

      rowChart
        .width(estepConf.ROWCHART_DIMENSIONS.width)
        .height(chartheight(group.top(Infinity).length))
        .fixedBarHeight(estepConf.ROWCHART_DIMENSIONS.barHeight)
        .dimension(dimension)
        .group(group)
        .data(function(d) {
          return d.top(50);
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

    ProjectsNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.projects').controller('ProjectsCompetenceController', ProjectsCompetenceController);
})();
