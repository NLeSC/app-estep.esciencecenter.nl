(function() {
  'use strict';

  function ChartsRegistryService(dc, Messagebus) {
    this.charts = {};
    this.delayedFilters = {};
    this.appliedFilters = {};
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

    this.applyExternalFilterToChart = function(ndxInstanceName, dimensionName, filter) {
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

    Messagebus.subscribe('applyExternalFilter' , function(event, value) {
      var chartID = value.chartID;
      var filter = value.filter;
      this.applyExternalFilterToChart(chartID.split(':')[0], chartID.split(':')[1], filter);
    }.bind(this));

    this.registerFilters = function(chart, filters) {
      var chartNames = Object.keys(this.charts);
      chartNames.forEach(function(chartName) {
        if (this.charts[chartName] === chart) {
          if (filters.length === 0) {
            delete this.appliedFilters[chartName];
          } else {
            if (this.appliedFilters[chartName] === undefined) {
              this.appliedFilters[chartName]  = {};
            }

            this.appliedFilters[chartName].chart = chart;
            this.appliedFilters[chartName].filters = filters;
          }
        }
      }.bind(this));
      // Object.keys(this.appliedFilters).forEach(function(chartName) {
      //   console.log('applied: ' + chartName);
      //   this.appliedFilters[chartName].filters.forEach(function(filter) {
      //     console.log(' - ' + filter);
      //   });
      // }.bind(this));
      //
      Messagebus.publish('filterChange', this.appliedFilters);
    };

    this.storeDelayedFilter = function(ndxInstanceName, dimensionName, filter) {
      var name = ndxInstanceName + ':' + dimensionName;
      this.delayedFilters[name] = filter;
    };
  }

  angular.module('estepApp.charts').service('ChartsRegistryService', ChartsRegistryService);
})();
