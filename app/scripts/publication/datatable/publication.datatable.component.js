(function() {
  'use strict';

  function PublicationDatatableController($element, $window, d3, dc, NdxService, DataHelperFunctions, DataService, $filter) {
    this.initializeChart = function() {
      var dataTable = dc.dataTable($element[0].children[0], 'publication');
      var dimension = NdxService.buildDimension('publication', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12 / 12) - 8)
        .dimension(dimension)
        .group(function(d) {
          // TODO group by publication date when available
          return 1;
        })
        .showGroups(false)
        .size(100)
        .columns([
          function(d) {
            var result = '<a class="citation" href="' + d['@id'] + '">' + d.bibliography + '</a>' +
                         '<div class="published_by">Published by' +
                         '<ul>';

            d.publishedBy.forEach(function(project) {
              result += '<li><a href="' + DataHelperFunctions.goto(project) + '">' + DataService.nameOf(project) + '</li>';
            })

            result += '</ul></div>'
            return result;
          }
        ])
        .sortBy(function(d) {
          // TODO sort by publication date when available
          return d.bibliography.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.publication').component('publicationDatatable', {
    templateUrl: 'scripts/publication/datatable/publication.datatable.component.html',
    controller: PublicationDatatableController
  });
})();
