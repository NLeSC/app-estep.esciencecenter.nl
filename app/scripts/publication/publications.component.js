(function() {
  'use strict';

  function publicationsController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('publication');
    });
  }

  angular.module('estepApp.publication').component('publications', {
    templateUrl: 'scripts/publication/publications.component.html',
    controller: publicationsController
  });
})();
