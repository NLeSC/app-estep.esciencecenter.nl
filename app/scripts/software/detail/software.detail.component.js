(function() {
  'use strict';

  function SoftwareDetailController($stateParams, $sce, NdxService, estepConf) {
    this.collection = 'software';
    this.slug = $stateParams.slug;
    this.licenseMap = {
      'apache-2.0': 'Apache 2.0',
      'mit': 'MIT',
      'mpl-2.0': 'Mozilla Public License 2.0'
    };

    NdxService.ready.then(function() {
      this.record = NdxService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));

    this.trustedHtml = function(field) {
      if (!this.record) {
        return '';
      }
      return $sce.trustAsHtml(this.record[field]);
    };

    this.licenseLabel = function(licenseId) {
      if (licenseId in this.licenseMap) {
        return this.licenseMap[licenseId];
      }
      return licenseId;
    };

    this.kindOfUrl = function(url) {
      if (url.startsWith(estepConf.ROOT_URL)) {
        return 'internal';
      } else if (url.includes('://')) {
        return 'external';
      } else {
        return false;
      }
    };

    this.goto = function(url) {
      var path = url.replace(estepConf.ROOT_URL, '');
      return path;
    };

    this.nameOf = function(url) {
      var r = NdxService.getRecordById(url);
      return r.record.name;
    };

  }

  angular.module('estepApp.software').component('softwareDetail', {
    templateUrl: 'scripts/software/detail/software.detail.component.html',
    controller: SoftwareDetailController
  });
})();
