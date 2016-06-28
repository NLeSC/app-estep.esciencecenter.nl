(function() {
  'use strict';

  function ProjectsDatatableController($window, d3, dc, ProjectsNdxService, Messagebus) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable('#dc-table-graph-proj');
      var projectsDimension = ProjectsNdxService.buildDimension(function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12/12) - 8)
        .dimension(projectsDimension)
        .group(function(d) { return 1; })
        .showGroups(false)
        .size(100)
        .columns([
            function(d) {
                return '<a href="' + d['@id'].replace('{{ site.url }}', '') + '">' + d.name + '</a>';
            },
            function(d) { return d.tagLine; }
        ])
        .sortBy(function(d){ return d.name.toLowerCase(); })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    ProjectsNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.projects').controller('ProjectsDatatableController', ProjectsDatatableController);
})();
