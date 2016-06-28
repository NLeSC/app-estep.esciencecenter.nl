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
            // function (d) {
            //   var result = '<div class="image-container">';
            //
            //   if (d.logo !== null) {
            //     result += '<a href="' + d['@id'] + '"><img src="' + d.logo + '" class="project-logo"></a>';
            //   } else {
            //     result += '<a href="' + d['@id'] + '"><img src="images/gray.png" class="empty project-logo"></a>';
            //   }
            //   return result + '</div>';
            // },
            // function(d) {
            //     return '<a href="' + d['@id'] + '">' + d.name + '</a>';
            // },
            // function(d) { return d.tagLine; }

            function (d) {
              var result = '<div class="project-logo-container"><a href="' + d['@id'] + '">' +
                           '<div class="project-title">' + d.name + '</div><div class="image-container">';

              if (d.logo !== null) {
                result += '<img src="' + d.logo + '" class="project-logo">';
              } else {
                result += '<img src="images/gray.png" class="empty project-logo">';
              }
              return result + '</div></a></div>';
            }
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
