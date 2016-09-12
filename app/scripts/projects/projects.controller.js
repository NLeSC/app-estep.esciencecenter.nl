(function() {
  'use strict';

  function ProjectsController(NdxService, dc, $scope) {
    NdxService.ready.then(function() {
      dc.redrawAll('projects');
    });
    $scope.$on('$destroy',function() {
      dc.deregisterAllCharts('projects');
    });

  }

  angular.module('estepApp.projects').controller('ProjectsController', ProjectsController);
})();
