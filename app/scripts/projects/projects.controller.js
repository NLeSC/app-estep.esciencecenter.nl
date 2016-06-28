(function() {
  'use strict';

  function ProjectsController(dc, ProjectsNdxService) {
    this.initializeChart = function() {
      var ndx = ProjectsNdxService.getNdx();
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-projects')
        .dimension(ndx)
        .group(all);

      dataCounter.render();
    };

    ProjectsNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.projects').controller('ProjectsController', ProjectsController);
})();
