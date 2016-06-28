(function() {
  'use strict';

  function NdxService(SoftwareNdxService, ProjectsNdxService) {
    // this.ndx = {};
    // this.dimensions = [];
    // var deferred = $q.defer();
    //
    // /**
    //  * Promise for loading the sites remotely.
    //  * Can be used to perform action when loading sites has been completed.
    //  *
    //  * @type {Promise}
    //  */
    // this.ready = deferred.promise;
    //
    // this.getSize = function() {
    //   return this.ndx.size();
    // };
    //
    // this.getNdx = function() {
    //   return this.ndx;
    // };
    //
    // this.readData = function(data) {
    //   //Crossfilter initialization
    //   this.ndx = crossfilter(data.software);
    //
    //   deferred.resolve();
    // }.bind(this);
    //
    // this.buildDimension = function(keyAccessor) {
    //   var newDimension = this.ndx.dimension(keyAccessor);
    //   this.dimensions.push(newDimension);
    //   return newDimension;
    // };
    //
    // this.resetData = function() {
    //   this.dimensions.forEach(function(d) {
    //     d.filter(null);
    //     d.dispose();
    //   });
    //   this.ndx.remove();
    //   Messagebus.publish('clearFilters');
    // };
    //
    // DataService.ready.then(function(newData) {
    //   this.readData(newData);
    // }.bind(this));

    this.getNdxService = function(ndxServiceName) {
      if (ndxServiceName === 'software') {
        return SoftwareNdxService;
      } else if (ndxServiceName === 'projects') {
        return ProjectsNdxService;
      }
    };
  }

  angular.module('estepApp.ndx').service('NdxService', NdxService);
})();
