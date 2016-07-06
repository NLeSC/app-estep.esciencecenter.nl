(function() {
  'use strict';

  function ChartsRegistryService(dc) {
    this.charts = {};
    this.delayedFilters = {};
    this.preRegisteredCharts = [];

    this.preRegister = function(ndxInstanceName, dimensionName) {
      var name = ndxInstanceName + ':' + dimensionName;
      this.preRegisteredCharts.push(name);
    };

    this.registerChart = function(ndxInstanceName, dimensionName, chart) {
      var name = ndxInstanceName + ':' + dimensionName;
      if (!this.charts.hasOwnProperty(name)) {
        this.charts[name] = chart;

        if (this.delayedFilters.hasOwnProperty(name)) {
          chart.filter(this.delayedFilters[name]);
          chart.render();
        }
      } else {
        console.error('Attempted to register chart ' + name + ' while it already existed.');
      }
    };

    this.getChart = function(ndxInstanceName, dimensionName) {
      var name = ndxInstanceName + ':' + dimensionName;
      if (!this.charts.hasOwnProperty(name)) {
        return null;
      }

      return this.charts[name];
    };

    this.applyFilterToChart = function(ndxInstanceName, dimensionName, filter) {
      var chart = this.getChart(ndxInstanceName, dimensionName);
      if (chart === null) {
        this.storeDelayedFilter(ndxInstanceName, dimensionName, filter);
      } else {
        dc.events.trigger(function() {
          chart.filter(filter);
          chart.redrawGroup();
        });
      }
    };

    this.storeDelayedFilter = function(ndxInstanceName, dimensionName, filter) {
      var name = ndxInstanceName + ':' + dimensionName;
      this.delayedFilters[name] = filter;
    };
  }

  angular.module('estepApp.charts').service('ChartsRegistryService', ChartsRegistryService);
})();
