(function() {
  'use strict';

  function ProjectsController(dc, NdxService, $state) {
    var collection = 'projects';

    this.initializeChart = function() {
      var ndx = NdxService.getNdxInstance(collection);
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-projects', collection)
        .dimension(ndx)
        .group(all);

      dataCounter.render();
    };

    this.resetAll = function() {
      dc.filterAll(collection);
      dc.renderAll(collection);
      $state.go('projects-list', {}, {inherit: false});
    };

    this.initializeChart();
  }

  angular.module('estepApp.projects').controller('ProjectsController', ProjectsController);
})();
