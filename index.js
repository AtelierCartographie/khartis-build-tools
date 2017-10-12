/* eslint-env node */
'use strict';
const mergeTrees = require('broccoli-merge-trees'),
      buildCommand = require('./lib/commands/build');

module.exports = {
  name: 'khartis-build-tools',
  configObject: {},
  
    isDevelopingAddon: function() {
      return true;
    },
    includedCommands() {
      return {
        "khartis:build": buildCommand
      };
    },
    postprocessTree(type, tree) {
      if (process.env.KHARTIS_THUMBNAILS_BUILD !== "false" && type === 'all') {
        const Thumbnailer = require('./lib/tasks/thumbnailer')
        return mergeTrees([tree, new Thumbnailer([tree])], {overwrite: true});
      }
      return tree;
    },
    config: function (env, baseConfig) {
      this.configObject = baseConfig;
    }
};
