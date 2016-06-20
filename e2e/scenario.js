'use strict';

/* global describe, beforeEach, it, expect */
/* global browser */

describe('estepApp', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it('should have eScience Technology Pages title', function() {
    expect(browser.getTitle()).toMatch('eScience Technology Pages');
  });
});
