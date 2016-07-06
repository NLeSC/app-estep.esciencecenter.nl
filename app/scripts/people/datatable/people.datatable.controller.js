(function() {
  'use strict';

  function PeopleDatatableController($window, d3, dc, NdxService, Messagebus) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable('#dc-table-graph-people', 'people');
      var dimension = NdxService.buildDimension('people', 'datatable', function(d) {
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
            var result = '<div class="people-container"><a href="' + d['id'] + '">' +
              '<div class="image-container">';

            if (d.photo !== null && d.photo !== undefined) {
              result += '<img src="' + d.photo + '" class="photo">';
            } else {
              result += '<img src="images/team_default.png" class="empty photo">';
            }
            result += '<div class="people-name">' + d.name + '</div>';

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

  angular.module('estepApp.people').controller('PeopleDatatableController', PeopleDatatableController);
})();
