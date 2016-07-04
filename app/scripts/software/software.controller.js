(function() {
  'use strict';

  function SoftwareController($scope, dc, NdxService) {
    this.ndx = null;

    this.initializeChart = function() {
      this.ndx = NdxService.getNdxInstance('software');
      var all = this.ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-software')
        .dimension(this.ndx)
        .group(all);
      dataCounter.render();
    };

    $scope.filterAll = function() {
      this.ndx.filterAll();
    };

    NdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
