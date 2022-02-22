const fs = require("fs");
const { configs } = require("./static");
const { resolve } = require("path");
const hash = require("object-hash");
const git = require("simple-git")();
const axios = require("axios").default;
const { createHtmlTagObject } = require("./html-tags");

function trainCaseToCamelCase(word) {
  return word.replace(/-([\w])/g, function (match, p1) {
    return p1.toUpperCase();
  });
}
function tapCompilationEvent(compilation, eventName, handler) {
  // Webpack 4 has a new interface
  if (compilation.hooks) {
    return compilation.hooks[trainCaseToCamelCase(eventName)].tapAsync(
      "AsyncPlugin" + tapCompilationEvent.counter++,
      handler
    );
  } else {
    return compilation.plugin(eventName, handler);
  }
}

class DevLatest {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.plugin("compilation", function (compilation) {
      tapCompilationEvent(
        compilation,
        "html-webpack-plugin-alter-asset-tags",
        function (pluginArgs, callback) {
          git.branch().then(({ current }) => {
            git.show(current + ":package.json").then((package_json) => {
              const timestamp = `${new Date().getTime()}`;
              // console.log(package_json);
              const pageageJson = JSON.parse(package_json);
              // const hashVal = hash({ timestamp });
              git.log().then((res) => {
                configs.forEach((config) => {
                  pluginArgs.body.push(
                    createHtmlTagObject(config.meta, config.attr)
                  );
                });
                pluginArgs.body.push(
                  createHtmlTagObject("div", {
                    id: "kissdev",
                    // branch: current,
                    project_name: pageageJson.name,
                    ref: "refs/heads/" + current,
                    hash: res.latest.hash,
                  })
                );
                pluginArgs.body.push(
                  createHtmlTagObject(
                    "script",
                    {},
                    fs.readFileSync(resolve(__dirname, "client.js"))
                  )
                );
                callback(null, pluginArgs);
              });
              // axios({
              //   method: "post",
              //   url: "http://127.0.0.1:8888/expired",
              //   data: {
              //     hash: hashVal,
              //     branch: current,
              //     project_name: pageageJson.name,
              //   },
              // });
            });
          });
        }
      );
    });
  }
}

module.exports = DevLatest;
