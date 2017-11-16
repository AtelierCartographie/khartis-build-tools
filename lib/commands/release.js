'use strict';

const Command = require('ember-cli/lib/models/command'),
      childProcess = require('child_process'),
      options = require('../utils/publish-options'),
      publisher = require('electron-simple-publisher/lib/publisher'),
      path = require('path'),
      fs = require('fs');

module.exports = Command.extend({
  name: 'khartis:release',
  description: 'Publish khartis electron release',
  availableOptions: options,
  run: function(options) {
    return new Promise((res, rej) => {
      process.on('SIGINT', function() {
        rej();
        process.exit();
      });
      if (!(options.make === false || options.make === "false")) {
        let buildPipeline = [];
        if (!(options.skipbuild === "true" || options.skipbuild === true)) {
          buildPipeline.push('ember electron:build --output-path electron-out/ember');
        }
        if (!(options.skipassemble === "true" || options.skipassemble === true)) {
          buildPipeline.push('ember electron:assemble --build-path electron-out/ember --output-path electron-out/project');
        }
        if (!(options.skippackage === "true" || options.skippackage === true)) {
          buildPipeline.push('ember electron:package --project-path electron-out/project --platform=darwin,win32,linux');
        }
        buildPipeline = buildPipeline.concat([
          'ember electron:make --skip-package --platform=darwin',
          'ember electron:make --skip-package --platform=win32',
          'ember electron:make --skip-package --platform=linux'
        ]);
        let proc = childProcess.exec(buildPipeline.join(' && '));
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);
        proc.on("exit", () => {
            console.log("Realease : ok");
            res();
          });
      } else {
        res();
      }
    }).then( () => {
      if (!(options.publish === false || options.publish === "false")) {
        return new Promise((res, rej) => {
          let publisherJsonFile = path.join(__dirname, "..", "..", "publisher.json");
          if (!fs.existsSync(publisherJsonFile) || options.configure === true || options.configure === "true") {
            console.log("Configuring publisher");
            console.log("Enter your github API token :");
            process.stdin.resume();
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', function (text) {
              process.stdin.pause();
              generatePublisherJson(text.replace(/\n$/, ''));
              publish(publisherJsonFile).then( () => res() ).catch((e) => rej(e));
            });
          } else {
            publish(publisherJsonFile).then( () => res() ).catch((e) => rej(e));
          }
        });
      } else {
        return Promise.resolve();
      }
    });
  }
});

function generatePublisherJson(token) {
  let publisherJsonFile = path.join(__dirname, "..", "..", "publisher.json"),
      publisherJsonFileTpl = path.join(__dirname, "..", "..", "publisher.json.tpl");
  let json = JSON.parse(fs.readFileSync(publisherJsonFileTpl, "utf8"));
  json.transport.token = token;
  fs.writeFileSync(publisherJsonFile, JSON.stringify(json), "utf8");
}

function publish(publisherJsonFile) {
  return publisher.run({
    command: "publish",
    config: publisherJsonFile,
    path: "electron-out/make",
    builds: [
      'darwin-x64',
      'winSquirrel-x64'
    ]
  });
}
