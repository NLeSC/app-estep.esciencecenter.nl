(function() {
  'use strict';

  function ProjectsDatatableController($element, $window, d3, dc, NdxService, $state) {
    this.initializeChart = function() {
      var dataTable = dc.dataGrid($element[0].children[0], 'projects');
      var projectsDimension = NdxService.buildDimension('projects', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.dimension(projectsDimension)
        .group(function(d) {
          return 1;
        })
        .html(function(d) {
          var url = $state.href('project-detail', {slug: d.slug, subsite: $state.params.subsite});
          var result = '<a href="' + url + '">' +
                       '<div class="project-title">' + d.name + '</div><div class="image-container">';

          if (d.logo === null) {
            result += '<span class="placeholder-gray"></span>';
          } else {
            result += '<img src="' + d.logo + '" class="card-logo">';
          }
          return result + '</div></a>';
        })
        .htmlGroup(function() {
          return '';
        })
        .sortBy(function(d) {
          return d.name.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.report').component('projectsDatagrid', {
    templateUrl: 'scripts/projects/datagrid/projects.datagrid.component.html',
    controller: ProjectsDatatableController
  });
})();
