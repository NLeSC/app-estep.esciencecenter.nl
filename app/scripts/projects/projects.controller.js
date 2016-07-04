(function() {
  'use strict';

  function ProjectsController(dc, NdxService) {
    this.initializeChart = function() {
      var ndx = NdxService.getNdxInstance('projects');
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-projects')
        .dimension(ndx)
        .group(all);

      dataCounter.render();
    };

    NdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.projects').controller('ProjectsController', ProjectsController);
})();
