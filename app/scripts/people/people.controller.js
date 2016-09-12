(function() {
  'use strict';

  function PeopleController(NdxService, dc, $scope) {
    NdxService.ready.then(function() {
      dc.redrawAll('people');
    });
    $scope.$on('$destroy',function() {
      dc.deregisterAllCharts('people');
    });

  }

  angular.module('estepApp.people').controller('PeopleController', PeopleController);
})();
