'use strict';

module.exports = function(options) {
  console.log("---- KARTHIS BUILD TOOLS ----");
  process.env.KHARTIS_THUMBNAILS_BUILD = options.thumbnails ? "true" : "false";
  console.log(`generate map thumbnails : ${options.thumbnails ? 'yes' : 'no'}`);
  console.log("-----------------------------");
};
