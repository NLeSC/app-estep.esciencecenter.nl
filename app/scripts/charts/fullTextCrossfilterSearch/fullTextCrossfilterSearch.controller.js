(function() {
  'use strict';

  function FullTextCrossfilterSearchController($scope, $element, d3, dc, NdxService, NdxHelperFunctions) {
    this.input ='';

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
      
      dc.redrawAll();
    }

    this.initializeChart = function(element, ndxService, jsonFields, chartHeader) {
      this.ndxService = ndxService;

      var ctrl = this;
      ctrl.chartHeader = chartHeader;

      var fields = jsonFields.split(',');
      fields.forEach(function (field, index) {
        fields[index] = field.trim();
      });

      this.dimension = NdxHelperFunctions.buildDimensionWithProperties(ndxService, fields);
    };

    this.linkedInit = function(element, ndxServiceName, jsonFields, chartHeader) {
      var ndxService = NdxService.getNdxService(ndxServiceName);
      ndxService.ready.then(function() {
        this.initializeChart(element, ndxService, jsonFields, chartHeader);
      }.bind(this));
    };
  }

  angular.module('estepApp.charts').controller('FullTextCrossfilterSearchController', FullTextCrossfilterSearchController);
})();
