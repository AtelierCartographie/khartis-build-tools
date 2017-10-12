/* eslint-env node */
'use strict';
const mergeTrees = require('broccoli-merge-trees'),
      commands = require('./lib/commands');

module.exports = {
  name: 'khartis-thumbnailer',
  configObject: {},
  
    isDevelopingAddon: function() {
      return true;
    },
    includedCommands() {
      console.log(commands);
      return commands;
    },
    postprocessTree(type, tree) {
      if (!process.env.KHARTIS_THUMBNAILS_BUILD || !this.configObject.mapThumbnail.generate || type !== 'all') {
        return tree;
      }
      const Thumbnailer = require('./lib/tasks/thumbnailer')
      return mergeTrees([tree, new Thumbnailer([tree])]);
    },
    config: function (env, baseConfig) {
      this.configObject = baseConfig;
    }
};
