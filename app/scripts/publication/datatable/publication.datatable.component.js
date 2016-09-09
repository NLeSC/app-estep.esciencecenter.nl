(function() {
  'use strict';

  function PublicationDatatableController($element, $window, d3, dc, NdxService, DataHelperFunctions, DataService) {
    this.collection = 'publication';

    this.publicationYear = function(d) {
      // year of publication
      return this.publicationDate(d).getUTCFullYear();
    };

    this.publicationDate = function(d) {
      return new Date(d.date);
    };

    this.renderPublication = function(d) {
      var result = '<a class="citation" href="' + d.doi + '">' + d.description + '</a>' +
                   '<div class="authors">Authors' +
                   '<ul>';

      d.author.forEach(function(author) {
        result += '<li><a href="' + DataHelperFunctions.goto(author) + '">' + DataService.nameOf(author) + '</li>';
      });

      result += '</ul></div>';
      return result;
    };

    this.initializeChart = function() {
      var dataTable = dc.dataTable($element[0].children[0], this.collection);
      var dimension = NdxService.buildDimension(this.collection, 'datatable', function(d) {
        return [d['@id']];
      });

      dataTable.width($window.innerWidth * (12 / 12) - 8)
        .dimension(dimension)
        .group(this.publicationYear.bind(this))
        .showGroups(true)
        .size(100)
        .columns([this.renderPublication.bind(this)])
        .sortBy(this.publicationDate.bind(this))
        // (optional) sort order, :default ascending
        .order(d3.descending);

      dataTable.render();
    };

    this.initializeChart();
  }

  angular.module('estepApp.publication').component('publicationDatatable', {
    templateUrl: 'scripts/publication/datatable/publication.datatable.component.html',
    controller: PublicationDatatableController
  });
})();
