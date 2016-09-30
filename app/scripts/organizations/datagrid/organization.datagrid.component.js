(function() {
  'use strict';

  function OrganizationDatagridController($element, d3, dc, NdxService, $state) {

    this.initializeChart = function() {
      var dataGrid = dc.dataGrid($element[0].children[0], 'organizations');
      var dimension = NdxService.buildDimension('organizations', 'datagrid', function(d) {
        return [d['@id']];
      });

      dataGrid.dimension(dimension)
        .group(function(d) {
          return 1;
        })
        .html(function(d) {
          var url = $state.href('organization-detail', {slug: d.slug, subsite: $state.params.subsite});
          var result = '<a href="' + url + '">' +
                       '<div class="organization-title">' + d.name + '</div><div class="image-container">';

          if ('logo' in d && d.logo !== null) {
            result += '<img src="' + d.logo + '" class="card-logo">';
          } else {
            result += '<span class="placeholder-gray"></span>';
          }
          return result + '</div></a>';
        })
        .htmlGroup(function() {
          return '';
        })
        .sortBy(function(d) {
          return d.name.toLowerCase();
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);

      dataGrid.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.organizations').component('organizationDatagrid', {
    templateUrl: 'scripts/organizations/datagrid/organization.datagrid.component.html',
    controller: OrganizationDatagridController
  });
})();
