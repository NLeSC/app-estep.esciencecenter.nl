(function() {
  'use strict';

  function ReportDatatableController($element, $window, d3, dc, NdxService, DataHelperFunctions, DataService, $filter) {
    this.initializeChart = function() {
      var dataTable = dc.dataTable($element[0].children[0], 'report');
      var dimension = NdxService.buildDimension('report', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12 / 12) - 8)
        .dimension(dimension)
        .group(function(d) {
          return 1;
        })
        .showGroups(false)
        .size(100)
        .columns([
          function(d) {
            var coverUrl = DataHelperFunctions.goto(d.cover);
            var reportUrl = DataHelperFunctions.goto(d.link);

            var result = '<div class="report-card"><a href="' + reportUrl + '">' +
                         '<img class="cover" src="' + coverUrl + '"/>' +
                         '<h2>' + d.title + '</h2></a>' +
                         '<h3><ul>';

            d.author.forEach(function(a) {
              var authorName = DataService.nameOf(a);
              var authorUrl = DataService.linkOfPersonOrOrganization(a);
              result += '<li><a href="' + authorUrl + '">' + authorName + '</a></li>';
            });

            result += '</ul></h3>' +
                      '<a href="' + reportUrl + '">' +
                      '<h3>' + $filter('date')(new Date(d.date), 'MMMM yyyy') + '</h3>' +
                      '<div class="content">' + d.description + '</div>' +
                      '</div>';
            return result;
          }
        ])
        .sortBy(function(d) {
          return d.title.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.report').component('reportDatatable', {
    templateUrl: 'scripts/report/datatable/report.datatable.component.html',
    controller: ReportDatatableController
  });
})();
