/* eslint-env node */
'use strict';
const Thumbnailer = require('./addon/thumbnailer'),
      mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'khartis-thumbnailer',
  configObject: {},
  
    isDevelopingAddon: function() {
      return true;
    },
    postprocessTree(type, tree) {
      if (!this.configObject.mapThumbnail.generate || type !== 'all') {
        return tree;
      }
      return mergeTrees([tree, new Thumbnailer([tree])]);
    },
    config: function (env, baseConfig) {
      this.configObject = baseConfig;
    }
};
