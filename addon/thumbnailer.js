const Plugin = require('broccoli-plugin'),
  path = require('path'),
  fs = require('fs-extra'),
  puppeteer = require('puppeteer'),
  express = require('express');

const elBbox = function (el) {
  return Promises.all([el._client.send('Page.getLayoutMetrics'), el._client.send('DOM.getBoxModel', { objectId: el._remoteObject.objectId })])
    .then( ([layoutMetrics, boxModel]) => {
      if (!boxModel || !boxModel.model)
        return null;
      return {
        x: boxModel.model.margin[0] + (layoutMetrics && layoutMetrics.layoutViewport ? layoutMetrics.layoutViewport.pageX : 0),
        y: boxModel.model.margin[1] + (layoutMetrics && layoutMetrics.layoutViewport ? layoutMetrics.layoutViewport.pageY : 0),
        width: boxModel.model.width,
        height: boxModel.model.height
      };
    });
};

// Create a subclass Thumbnailer derived from Plugin
Thumbnailer.prototype = Object.create(Plugin.prototype);
Thumbnailer.prototype.constructor = Thumbnailer;
function Thumbnailer(inputNodes, options) {
  options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

Thumbnailer.prototype.build = function () {
  let srcDir = this.inputPaths[0],
    outputPath = this.outputPath;
  let serv = express();
  serv.use("/assets", express.static(srcDir + "/assets"));
  serv.use("/data", express.static(srcDir + "/data"));
  serv.all("/*", function (req, res) {
    res.sendFile('index.html', { root: srcDir });
  });
  return new Promise((res, rej) => {
    let servInst = serv.listen(3001, function () {
      console.log(`[Thumbnailer] Express server started in ${srcDir}`);
      fs.ensureDirSync(`${outputPath}/assets/images/map-thumbnails`);
      return puppeteer.launch()
        .then(browser => Promise.all([browser, browser.newPage()]))
        .then(([browser, page]) => {
          // page.on('console', (...args) => {
          //   for (let i = 0; i < args.length; ++i)
          //     console.log(`${i}: ${args[i]}`);
          // });
          page.waitFor(() => window.__mapThumbnails != null, { timeout: 60000 })
            .then(() => page.evaluate(() => window.__mapThumbnails))
            .then(mtn => {
              return page.$$(".map-editor").then(els => {
                return Promise.all(els.map((el, i) => {
                  return elBbox(el)
                    .then(bbox => page.screenshot({ path: `${outputPath}/assets/images/map-thumbnails/${mtn[i].id}.png`, clip: bbox }))
                    .then(() => console.log(`[Thumbnailer] Generating map thumbnail for ${mtn[i].id}`));
                }));
              });
            })
            .then(() => {
              servInst.close();
              browser.close();
              res();
            })
            .catch(console.log);
          return page.goto("http://localhost:3001/map-thumbnails");
        });
    });
  });
};

module.exports = Thumbnailer;
