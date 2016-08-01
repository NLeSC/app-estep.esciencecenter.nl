(function() {
  'use strict';

  function FullTextCrossfilterSearchController($element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions) {
    var ctrl = this;
    this.input = '';
    this.chartHeader = $attrs.chartHeader;
    this.ndxInstanceName = $attrs.ndxServiceName;
    this.NdxService = NdxService;
    this.stateFieldName = 'keywords';

    var dimensionName = 'textSearch';
    var fields = $attrs.jsonFields.split(',').map(function(field) {
      return field.trim();
    });
    this.dimension = NdxHelperFunctions.buildDimensionWithProperties(this.ndxInstanceName, dimensionName, fields);

    var _chart = dc.baseMixin({})
      .chartGroup(this.ndxInstanceName)
      .dimension(this.dimension)
      .filterHandler(function(dimension, filters) {
        var result = NdxHelperFunctions.fulltextFilterHandler()(dimension, filters);
        var params = {};
        params[ctrl.stateFieldName] = result[0];
        $state.go(ctrl.ndxInstanceName, params, {notify: false});
        return result;
      });
    _chart.render = function() {
      if (!this.filter()) {
        ctrl.input = '';
      }
      return _chart;
    };
    NdxHelperFunctions.applyState(_chart, this.ndxInstanceName, this.stateFieldName);

    this.applyFilter = function() {
      var filter = this.input;
      dc.events.trigger(function () {
          _chart.filter(filter);
          _chart.redrawGroup();
      });
    };
  }

  angular.module('estepApp.charts').controller('FullTextCrossfilterSearchController', FullTextCrossfilterSearchController);
})();
