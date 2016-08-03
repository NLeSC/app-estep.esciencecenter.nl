(function() {
  'use strict';

  function BreadcrumbsController($attrs, dc, Messagebus) {
    this.filters = [];

    this.clearFilter = function(appliedFilter) {
      // TODO does not undo selection
      appliedFilter.chart.filter(appliedFilter.query);
    };

    Messagebus.subscribe('newFilterEvent', function(event, appliedFilters) {
      // TODO full text search keeps adding new crumbs
      if (appliedFilters.filters.length) {
        appliedFilters.filters.forEach(function(d) {
          this.filters.push({
            query: d,
            chart: appliedFilters.chart,
            header: appliedFilters.header
          });
        }, this);
      } else {
        // remove other filters of the chart
        this.filters = this.filters.filter(function(d) {
          return (appliedFilters.chart !== d.chart);
        });
      }
    }.bind(this));
  }

  angular.module('estepApp.breadcrumbs')
    .controller('BreadcrumbsController', BreadcrumbsController);
})();
