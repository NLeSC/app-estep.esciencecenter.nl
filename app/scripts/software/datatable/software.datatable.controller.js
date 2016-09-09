(function() {
  'use strict';

  function SoftwareDatatableController($element, d3, dc, NdxService, $state) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable($element[0].children[0], 'software');
      var softwareDimension = NdxService.buildDimension('software', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width(parseInt($element[0].getClientRects()[0].width, 10))
        .dimension(softwareDimension)
        .group(function(d) { return 1; })
        .showGroups(false)
        .size(100)
        .columns([
            function(d) {
                var url = $state.href('software-detail', {slug: d.slug, subsite: $state.params.subsite});
                return '<a href="' + url + '">' + d.name + '</a>';
            },
            function(d) { return d.tagLine; }
        ])
        .sortBy(function(d) { return d.name.toLowerCase(); })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.software').controller('SoftwareDatatableController', SoftwareDatatableController);
})();
