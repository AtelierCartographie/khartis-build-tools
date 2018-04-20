const Plugin = require('broccoli-plugin'),
  path = require('path'),
  exec = require("child_process").exec,
  fs = require('fs-extra');

// Create a subclass Mkdocs derived from Plugin
MkDocs.prototype = Object.create(Plugin.prototype);
MkDocs.prototype.constructor = MkDocs;
function MkDocs(inputNodes, options) {
  options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

MkDocs.prototype.copyToSrc = function(file) {
  let base = process.cwd();
  fs.ensureDirSync(`${base}/public/site`);
  return new Promise( (res, rej) => {
    fs.copy(file, `${base}/public/site`, function(err) {
      if (err) rej(err);
      res();
    });
  });
};

MkDocs.prototype.build = function () {
  let srcDir = this.inputPaths[0],
    outputPath = this.outputPath,
    processOriginalPath = process.cwd();
  return new Promise((res, rej) => {
    const command = "mkdocs build";
    fs.ensureDirSync(`${outputPath}/site`);
    console.log(`chdir : ${srcDir}`);
    process.chdir(srcDir);
    exec(command, (error, stdout) => {
      process.chdir(processOriginalPath);
      error ? rej(error): res(`${srcDir}/site`);
    });
  }).then(this.copyToSrc)
};

module.exports = MkDocs;
