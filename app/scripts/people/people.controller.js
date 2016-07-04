(function() {
  'use strict';

  function PeopleController(dc, NdxService) {
    this.initializeChart = function() {
      var ndx = NdxService.getNdxInstance('people');
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-people')
        .dimension(ndx)
        .group(all);

      dataCounter.render();
    };

    NdxService.ready.then(function() {
      this.initializeChart();
    }.bind(this));
  }

  angular.module('estepApp.people').controller('PeopleController', PeopleController);
})();
