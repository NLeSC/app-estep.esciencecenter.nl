(function() {
  'use strict';

  function SubsiteController($attrs, $stateParams, $state, estepConf, NdxHelperFunctions, NdxService, DataService) {
    var ctrl = this;
    ctrl.jsonArrayFieldToChart = $attrs.jsonArrayFieldToChart;
    ctrl.ndxInstanceName = $attrs.ndxServiceName;

    var fields = $attrs.jsonFields.split(',').map(function(field) {
      return field.trim();
    });
    ctrl.dimension = NdxHelperFunctions.buildWhitelistedDimensionWithProperties(ctrl.ndxInstanceName, estepConf.SUBSITE_WHITELIST, 'subsiteDimension2', fields);
    // ctrl.group = NdxHelperFunctions.buildWhitelistedGroupWithProperties(ctrl.dimension, estepConf.SUBSITE_WHITELIST, fields);

    this.subsites = [];

    ctrl.isActive = function(subsite) {
      return subsite === $stateParams.subsite;
    };
    ctrl.go = function(subsite) {
      $state.go('.', {subsite: subsite});
    };

    ctrl.fillSubsites = function() {
      ctrl.subsites = ['Any'].concat(estepConf.SUBSITE_WHITELIST);
    };

    ctrl.getName = function(subsiteID) {
      if (subsiteID === 'Any') {
        return 'Any';
      }
      return DataService.getRecordById(subsiteID).record.name;
    };

    NdxService.ready.then(ctrl.fillSubsites.bind(ctrl));
  }

  angular.module('estepApp.subsite').controller('SubsiteController', SubsiteController);
})();
