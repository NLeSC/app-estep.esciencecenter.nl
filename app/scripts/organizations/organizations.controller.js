(function() {
  'use strict';

  function organizationsController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('organisations');
    });
  }

  angular.module('estepApp.organizations').controller('organizationsController', organizationsController);
})();
