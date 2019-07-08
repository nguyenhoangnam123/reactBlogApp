"use strict";

const fs = require("fs");
const path = require("path");
const paths = require("./config/paths");

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve("./config/paths")];
process.env.NODE_ENV = "production";
const NODE_ENV = process.env.NODE_ENV;
var dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean);

console.log("dotenv files: ", dotenvFiles);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv").config({
      path: dotenvFile
    });
  }
});

const REACT_APP = /^REACT_APP_/i;
function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || "development",
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  return { raw, stringified };
}

// console.log("react app variable: ", REACT_APP);
console.log("object process env", Object.keys(process.env));

console.log("raw", getClientEnvironment("/").raw);
console.log("key raw", Object.keys(getClientEnvironment("/").raw));
console.log("stringify", getClientEnvironment("/").stringified);
