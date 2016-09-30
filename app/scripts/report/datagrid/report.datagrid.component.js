(function() {
  'use strict';

  function ReportDatagridController($element, d3, dc, NdxService, DataHelperFunctions, DataService, $filter) {
    this.initializeChart = function() {
      var dataGrid = dc.dataGrid($element[0].children[0], 'report');
      var dimension = NdxService.buildDimension('report', 'datagrid', function(d) {
        return [d['@id']];
      });

      dataGrid.dimension(dimension)
        .group(function(d) {
          return 1;
        })
        .html(function(d) {
          var coverUrl = DataHelperFunctions.goto(d.cover);
          var reportUrl = DataHelperFunctions.goto(d.link);

          var result = '<a href="' + reportUrl + '">' +
                       '<img class="cover" src="' + coverUrl + '"/>' +
                       '<h2>' + d.title + '</h2></a>' +
                       '<h3><ul class="authors">';

          d.author.forEach(function(a) {
            var authorName = DataService.nameOf(a);
            var authorUrl = DataService.linkOfPersonOrOrganization(a);
            result += '<li><a href="' + authorUrl + '">' + authorName + '</a></li>';
          });

          result += '</ul></h3>' +
                    '<a href="' + reportUrl + '">' +
                    '<h3>' + $filter('date')(new Date(d.date), 'MMMM yyyy') + '</h3>' +
                    '<div class="content">' + d.description + '</div>';
          return result;
        })
        .htmlGroup(function() {
          return '';
        })
        .sortBy(function(d) {
          return d.title.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataGrid.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.report').component('reportDatagrid', {
    templateUrl: 'scripts/report/datagrid/report.datagrid.component.html',
    controller: ReportDatagridController
  });
})();
