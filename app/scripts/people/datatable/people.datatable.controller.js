(function() {
  'use strict';

  function PeopleDatatableController($window, d3, dc, NdxService, $state) {

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
            var url = $state.href('people-detail', {slug: d.slug, subsite: $state.params.subsite});
            var result = '<div class="people-container"><a href="' + url + '">' +
              '<div class="image-container">';

            if (d.photo !== null && d.photo !== undefined) {
              result += '<img src="' + d.photo + '" class="photo">';
            } else {
              result += '<span class="empty photo placeholder-person"></span>';
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
