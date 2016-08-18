(function() {
  'use strict';

  function BreadcrumbsController(Messagebus, NdxHelperFunctions, NdxService, $stateParams) {
    var ctrl = this;
    this.filters = [];

    this.clearFilter = function(appliedFilter) {
      appliedFilter.chart.filter([appliedFilter.query]);
      appliedFilter.chart.redrawGroup();
    };

    this.registerFilter = function(appliedFilters) {
      if (appliedFilters.filters.length) {
        // remove all filters of the chart
        this.filters = this.filters.filter(function(d) {
          return (appliedFilters.header !== d.header);
        });
        // add filters of chart
        appliedFilters.filters.forEach(function(d) {
          this.filters.push({
            query: d,
            chart: appliedFilters.chart,
            header: appliedFilters.header
          });
        }, this);
      } else {
        // remove all filters of the chart
        this.filters = this.filters.filter(function(d) {
          return (appliedFilters.header !== d.header);
        });
      }
    };

    Messagebus.subscribe('newFilterEvent', function(event, appliedFilters) {
      if (appliedFilters.chart !== undefined &&
          this.collection === appliedFilters.chart.chartGroup()) {
        this.registerFilter(appliedFilters);
      }
    }.bind(this));

    var appliedStates = NdxHelperFunctions.appliedStates(this.collection, $stateParams);
    appliedStates.forEach(function(d) {
      this.registerFilter(d);
    }, this);
  }

  angular.module('estepApp.breadcrumbs').component('breadcrumbsDirective', {
    templateUrl: 'scripts/breadcrumbs/breadcrumbs.directive.html',
    controller: BreadcrumbsController,
    bindings: {
      collection: '<'
    }
  });
})();
