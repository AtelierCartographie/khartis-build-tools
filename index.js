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
      if (process.env.KHARTIS_MKDOCS_BUILD === "true" && type === 'all') {
        const MkDocs = require('./lib/tasks/mkdocs')
        return mergeTrees([tree, new MkDocs([tree])], {overwrite: true});
      }
      return tree;
    },
    config: function (env, baseConfig) {
      this.configObject = baseConfig;
    }
};
