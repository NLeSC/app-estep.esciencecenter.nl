(function() {
  'use strict';

  function OrganizationDatatableController($window, d3, dc, NdxService, $state) {

    this.initializeChart = function() {
      var dataTable = dc.dataTable('#dc-table-graph-organization', 'organizations');
      var dimension = NdxService.buildDimension('organizations', 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12 / 12) - 8)
        .dimension(dimension)
        .group(function(d) {
          return 1;
        })
        .showGroups(false)
        .size(100)
        .columns([
          function(d) {
            var url = $state.href('organization-detail', {slug: d.slug, subsite: $state.params.subsite});
            var result = '<div class="organization-logo-container"><a href="' + url + '">' +
                         '<div class="organization-title">' + d.name + '</div><div class="image-container">';

            if ('logo' in d && d.logo !== null) {
              result += '<img src="' + d.logo + '" class="organization-logo">';
            } else {
              result += '<span class="placeholder-gray"></span>';
            }
            return result + '</div></a></div>';
          }
        ])
        .sortBy(function(d) {
          return d.name.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.organizations').component('organizationDatatable', {
    templateUrl: 'scripts/organizations/datatable/organization.datatable.component.html',
    controller: OrganizationDatatableController
  });
})();
