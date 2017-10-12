'use strict';

module.exports = {
  name: 'khartis:thumbnails',
  aliases: ['khartis:thumbnails'],
  description: 'Generate map thumbnails',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development' }
  ],
  run: function(options) {
    process.env.KHARTIS_THUMBNAILS_BUILD = 1;
    return this._super.run.apply(this, arguments);
  }
};
