(function() {
  'use strict';

  function EndorseFilterController($attrs, $state, NdxHelperFunctions) {
    var ctrl = this;
    var ndxInstanceName = $attrs.ndxServiceName;
    var jsonArrayFieldToChart = 'inGroup';
    var stateFieldName = 'endorser';
    var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxInstanceName, jsonArrayFieldToChart);
    if (ndxInstanceName === $state.$current.name &&
      stateFieldName in $state.params &&
      $state.params[stateFieldName]) {
      var filter = $state.params[stateFieldName];
      if (filter === 'All') {
        dimension.filterAll();
      } else {
        dimension.filter(filter);
      }
    }
  }

  angular.module('estepApp.charts').component('endorseFilter', {
    controller: EndorseFilterController
  });
})();
