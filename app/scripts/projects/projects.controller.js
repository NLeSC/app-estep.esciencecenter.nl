(function() {
  'use strict';

  function ProjectsController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('projects');
    });
  }

  angular.module('estepApp.projects').controller('ProjectsController', ProjectsController);
})();
