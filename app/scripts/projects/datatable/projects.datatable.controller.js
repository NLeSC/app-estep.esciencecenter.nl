(function() {
  'use strict';

  function ProjectsDatatableController($window, d3, dc, NdxService, $state) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable('#dc-table-graph-proj', 'projects');
      var projectsDimension = NdxService.buildDimension('projects', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12 / 12) - 8)
        .dimension(projectsDimension)
        .group(function(d) { return 1; })
        .showGroups(false)
        .size(100)
        .columns([
            function (d) {
              var url = $state.href('project-detail', {slug: d.slug, subsite: $state.params.subsite});
              var result = '<div class="project-logo-container"><a href="' + url + '">' +
                           '<div class="project-title">' + d.name + '</div><div class="image-container">';

              if (d.logo !== null) {
                result += '<img src="' + d.logo + '" class="project-logo">';
              } else {
                result += '<span class="placeholder-gray"></span>';
              }
              return result + '</div></a></div>';
            }
        ])
        .sortBy(function(d) {
          return d.name.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.projects').controller('ProjectsDatatableController', ProjectsDatatableController);
})();
