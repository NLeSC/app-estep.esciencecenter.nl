(function() {
  'use strict';

  function SoftwareController(dc, SoftwareNdxService) {
    this.initializeChart = function() {
      var ndx = SoftwareNdxService.getNdx();
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-software')
        .dimension(ndx)
        .group(all);
      dataCounter.render();
    };

    SoftwareNdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
