'use strict';

var ServeCommand = require('ember-cli/lib/commands/serve'),
    setEnv = require('../utils/set-env.js'),
    options = require('../utils/options');

module.exports = ServeCommand.extend({
  name: 'khartis:serve',
  description: 'Build khartis',
  availableOptions: ServeCommand.prototype.availableOptions.concat(options),
  run: function(options) {
    setEnv(options);
    return this._super.apply(this, arguments);
  }
});
