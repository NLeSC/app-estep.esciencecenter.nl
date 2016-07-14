(function() {
  'use strict';

  function EndorsedbyController($attrs, $stateParams, $state, NdxHelperFunctions, NdxService) {
    var jsonArrayFieldToChart = $attrs.jsonArrayFieldToChart;
    var ndxInstanceName = $attrs.ndxServiceName;
    var dimension = NdxHelperFunctions.buildDimensionWithArrayProperty(ndxInstanceName, jsonArrayFieldToChart);
    var group = NdxHelperFunctions.buildGroupWithArrayProperty(dimension, jsonArrayFieldToChart);

    this.endorsers = [];

    this.isActive = function(endorser) {
      return endorser === $stateParams.endorser;
    };
    this.go = function(endorser) {
      $state.go('.', {endorser: endorser});
    };

    this.fillEndorsers = function() {
      this.endorsers = ['All'].concat(group.top(Infinity).map(function(d) {
        return d.key;
      }));
    };

    NdxService.ready.then(this.fillEndorsers.bind(this));
  }

  angular.module('estepApp.endorsedby').controller('EndorsedbyController', EndorsedbyController);
})();
