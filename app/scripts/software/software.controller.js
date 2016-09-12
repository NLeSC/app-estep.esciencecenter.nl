(function() {
  'use strict';

  function SoftwareController(NdxService, dc, $scope) {
    NdxService.ready.then(function() {
      dc.redrawAll('software');
    });

    $scope.$on('$destroy',function() {
      dc.deregisterAllCharts('software');
    });
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
