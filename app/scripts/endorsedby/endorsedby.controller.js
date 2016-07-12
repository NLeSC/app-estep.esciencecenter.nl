(function() {
  'use strict';

  function EndorsedbyController() {
    this.endorsers = ['All', 'NLeSC', 'Meertens'];
  }

  angular.module('estepApp.endorsedby').controller('EndorsedbyController', EndorsedbyController);
})();
