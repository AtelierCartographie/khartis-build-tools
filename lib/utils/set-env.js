'use strict';

module.exports = function(options) {
  console.log("---- KARTHIS BUILD TOOLS ----");
  process.env.KHARTIS_THUMBNAILS_BUILD = options.thumbnails ? "true" : "false";
  process.env.KHARTIS_MKDOCS_BUILD = options.mkdocs ? "true" : "false";
  console.log(`generate map thumbnails : ${options.thumbnails ? 'yes' : 'no'}`);
  console.log(`generate documentation : ${options.mkdocs ? 'yes' : 'no'}`);
  console.log("-----------------------------");
};
