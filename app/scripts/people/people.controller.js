(function() {
  'use strict';

  function PeopleController(dc, NdxService, $state) {
    var collection = 'people';
    this.initializeChart = function() {
      var ndx = NdxService.getNdxInstance(collection);
      var all = ndx.groupAll();

      var dataCounter = dc.dataCount('#dc-data-count-people', collection)
        .dimension(ndx)
        .group(all);

      dataCounter.render();
    };

    this.resetAll = function() {
      dc.filterAll(collection);
      dc.renderAll(collection);
      $state.go('people-list', {}, {inherit: false});
    };
    this.initializeChart();
  }

  angular.module('estepApp.people').controller('PeopleController', PeopleController);
})();
