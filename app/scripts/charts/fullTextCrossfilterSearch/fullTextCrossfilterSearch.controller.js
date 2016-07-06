(function() {
  'use strict';

  function FullTextCrossfilterSearchController($element, $attrs, d3, dc, NdxService, NdxHelperFunctions) {
    var ctrl = this;
    this.input = '';
    this.chartHeader = $attrs.chartHeader;
    this.ndxInstanceName = $attrs.ndxServiceName;
    this.NdxService = NdxService;

    this.applyFilter = function() {
      var key = this.input;

      this.dimension.filterAll();
      if (key !== '') {
        var filters = [key];
        this.dimension.filterFunction(function(d) {
          var result = false;
          var filterString = filters[0];
          d.forEach(function(dim) {
            var re = new RegExp(filterString, 'i');
            if (result !== true && dim !== undefined && dim !== null && dim.search(re) !== -1) {
              result = true;
            }
          });
          return result;
        });
      }

      dc.redrawAll(this.ndxInstanceName);
    };

    var dimensionName = 'textSearch';
    var fields = $attrs.jsonFields.split(',').map(function(field) {
      return field.trim();
    });
    this.dimension = NdxHelperFunctions.buildDimensionWithProperties(this.ndxInstanceName, dimensionName, fields);
  }

  angular.module('estepApp.charts').controller('FullTextCrossfilterSearchController', FullTextCrossfilterSearchController);
})();
