(function() {
  'use strict';

  function BreadcrumbsController($scope, dc, Messagebus) {
    var me = this;
    me.filters = [];

    this.click = function(clickElement){
      Messagebus.publish('applyExternalFilter', {chartID: clickElement.chartID, filter: clickElement.filter});
    };

    Messagebus.subscribe('filterChange', function(event, appliedFilters) {
      $scope.$evalAsync( function() {
        me.filters = [];

        var chartNames = Object.keys(appliedFilters);
        chartNames.forEach(function(chartName) {
          appliedFilters[chartName].filters.forEach(function(filter) {
            me.filters.push({
              chartID: chartName,
              filter: filter
            });
          });
        });
      });
    });
  }

  angular.module('estepApp.breadcrumbs')
    .controller('BreadcrumbsController', BreadcrumbsController);
})();
