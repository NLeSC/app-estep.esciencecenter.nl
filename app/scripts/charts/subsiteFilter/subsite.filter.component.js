(function() {
  'use strict';

  function SubsiteFilterController($attrs, $state, estepConf, NdxService, NdxHelperFunctions) {
    var ctrl = this;
    ctrl.input = '';
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.ndxInstanceName = $attrs.ndxServiceName;
    ctrl.NdxService = NdxService;
    ctrl.stateFieldName = 'subsite';

    var fields = $attrs.jsonFields.split(',').map(function(field) {
      return field.trim();
    });

    var dimension = NdxHelperFunctions.buildWhitelistedDimensionWithProperties(ctrl.ndxInstanceName, estepConf.SUBSITE_WHITELIST, 'subsiteDimension', fields);

    if (ctrl.ndxInstanceName === $state.$current.name &&
        ctrl.stateFieldName in $state.params &&
        $state.params[ctrl.stateFieldName]) {

      var filter = $state.params[ctrl.stateFieldName];

      if (filter === 'Any') {
        dimension.filterAll();
      } else {
        NdxHelperFunctions.bagFilterHandler()(dimension, [filter]);
      }
    }
  }

  angular.module('estepApp.charts').component('subsiteFilter', {
    controller: SubsiteFilterController
  });
})();
