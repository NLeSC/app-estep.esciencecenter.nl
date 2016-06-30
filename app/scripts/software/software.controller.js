(function() {
  'use strict';

  function SoftwareController(dc, SoftwareNdxService) {
    this.dimension = null;

    this.initializeChart = function() {
      this.dimension = SoftwareNdxService.getNdx();
      var all = this.dimension.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-software')
        .dimension(this.dimension)
        .group(all);
      dataCounter.render();
    };

    this.filterAll = function() {
      this.dimension.filterAll();
    };

    SoftwareNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
