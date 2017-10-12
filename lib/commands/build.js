'use strict';

var BuildCommand = require('ember-cli/lib/commands/build');

module.exports = BuildCommand.extend({
  name: 'khartis:build',
  description: 'Build khartis',
  works: 'insideProject',
  availableOptions: [
    { name: 'environment', type: String, default: 'development' }
  ],
  run: function(options) {
    process.env.KHARTIS_THUMBNAILS_BUILD = 1;
    return this._super.run.apply(this, arguments);
  }
});
