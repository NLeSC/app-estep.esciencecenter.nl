(function() {
  'use strict';

  function reportsController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('report');
    });
  }

  angular.module('estepApp.report').component('reports', {
    templateUrl: 'scripts/report/reports.component.html',
    controller: reportsController
  });
})();
