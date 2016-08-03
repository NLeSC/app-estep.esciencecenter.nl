(function() {
  'use strict';

  function SoftwareController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('software');
    });
  }

  angular.module('estepApp.software').controller('SoftwareController', SoftwareController);
})();
