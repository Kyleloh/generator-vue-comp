'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-vue-comp:add-directive', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/add-directive'))
      .inDir(path.join(__dirname, '../temp'))
      .withPrompts({
        // name: 'sub',
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
