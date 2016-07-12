(function() {
  'use strict';

  function SoftwareController(dc, NdxService, $state) {
    var collection = 'software';
    this.initializeChart = function() {
      this.ndx = NdxService.getNdxInstance(collection);
      var group = this.ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-software', collection)
        .dimension(this.ndx)
        .group(group);

      dataCounter.render();
    };

    this.resetAll = function() {
      dc.filterAll(collection);
      dc.renderAll(collection);
      $state.go(collection, {}, {inherit: false});
    };

    this.initializeChart();
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
