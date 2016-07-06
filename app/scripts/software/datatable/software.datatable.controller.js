(function() {
  'use strict';

  function SoftwareDatatableController($element, d3, dc, NdxService) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable('#dc-table-graph');
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
                return '<a href="' + d['@id'].replace('{{ site.url }}', '') + '">' + d.name + '</a>';
            },
            function(d) { return d.tagLine; }
        ])
        .sortBy(function(d){ return d.name.toLowerCase(); })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    NdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.software').controller('SoftwareDatatableController', SoftwareDatatableController);
})();
