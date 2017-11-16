/* eslint-env node */
'use strict';
const mergeTrees = require('broccoli-merge-trees'),
      buildCommand = require('./lib/commands/build'),
      releaseCommand = require('./lib/commands/release');

module.exports = {
  name: 'khartis-build-tools',
  configObject: {},
  
    isDevelopingAddon: function() {
      return true;
    },
    includedCommands() {
      return {
        "khartis:build": buildCommand,
        "khartis:release": releaseCommand
      };
    },
    postprocessTree(type, tree) {
      if (process.env.KHARTIS_THUMBNAILS_BUILD === "true" && type === 'all') {
        const Thumbnailer = require('./lib/tasks/thumbnailer')
        return mergeTrees([tree, new Thumbnailer([tree])], {overwrite: true});
      }
      return tree;
    },
    config: function (env, baseConfig) {
      this.configObject = baseConfig;
    }
};
