(function() {
  'use strict';

  function SubsiteFilterController($attrs, $state, NdxHelperFunctions) {
    var ndxInstanceName = $attrs.ndxServiceName;

    var dimension = NdxHelperFunctions.buildWhitelistedDimensionWithProperties(ndxInstanceName, whitelist, 'subsiteDimension', $attrs.jsonFields);

    if (ndxInstanceName === $state.$current.name) {
    // } &&
    //     stateFieldName in $state.params &&
    //     $state.params[stateFieldName]) {

      // var filter = $state.params[stateFieldName];

      // if (filter === 'Any') {
      //   dimension.filterAll();
      // } else {
      //   NdxHelperFunctions.bagFilterHandler()(dimension, [filter]);
      // }
    }
  }

  angular.module('estepApp.charts').component('subsiteFilter', {
    controller: SubsiteFilterController
  });
})();
