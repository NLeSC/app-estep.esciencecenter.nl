(function() {
  'use strict';

  function SubsiteController($attrs, $stateParams, $state, NdxHelperFunctions, NdxService, DataService) {
    var jsonArrayFieldToChart = $attrs.jsonArrayFieldToChart;
    var ndxInstanceName = $attrs.ndxServiceName;
    var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxInstanceName, jsonArrayFieldToChart);
    var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, jsonArrayFieldToChart);

    this.subsites = [];

    this.isActive = function(subsite) {
      return subsite === $stateParams.subsite;
    };
    this.go = function(subsite) {
      $state.go('.', {subsite: subsite});
    };

    this.fillSubsites = function() {
      this.subsites = ['Any'].concat(group.top(Infinity).map(function(d) {
        return d.key;
      }));
    };

    this.getName = function(subsiteID) {
      if (subsiteID === 'Any') {
        return 'Any';
      }
      return DataService.getRecordById(subsiteID).record.name;
    };

    NdxService.ready.then(this.fillSubsites.bind(this));
  }

  angular.module('estepApp.subsite').controller('SubsiteController', SubsiteController);
})();
