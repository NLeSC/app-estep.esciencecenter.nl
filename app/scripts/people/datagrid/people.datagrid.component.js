(function() {
  'use strict';

  function PeopleDatatableController($element, d3, dc, NdxService, $state) {

    this.initializeChart = function() {
      var grid = dc.dataGrid($element[0].children[0], 'people');
      var dimension = NdxService.buildDimension('people', 'datagrid', function(d) {
        return [d['@id']];
      });

      grid.dimension(dimension)
        .group(function(d) {
          return 1;
        })
        .html(function(d) {
          var url = $state.href('people-detail', {slug: d.slug, subsite: $state.params.subsite});
          var result = '<a href="' + url + '">' + '<div class="image-container">';

          if (d.photo !== null && d.photo !== undefined) {
            result += '<img src="' + d.photo + '" class="card-logo">';
          } else {
            result += '<div class="empty card-logo placeholder-person"></div>';
          }
          result += '</div><div class="people-name">' + d.name + '</div>';

          return result + '</a>';
        })
        .sortBy(function(d) {
          return d.name.toLowerCase();
        })
        .htmlGroup(function() {
          return '';
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      grid.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.people').component('peopleDatagrid', {
    templateUrl: 'scripts/people/datagrid/people.datagrid.component.html',
    controller: PeopleDatatableController
  });
})();
