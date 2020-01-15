import { dirname } from "path";
import { fileURLToPath } from "url";
import deepMerge from "./helpers/deepMerge.js";

const envDictionary = {
  dev: "develop",
  develop: "develop",
  development: "develop",
  production: "prod",
  prod: "prod",
  build: "build"
};

global.ENV = (
  process.env.APOLLON_ENV ||
  process.env.NODE_ENV ||
  "dev"
).toLowerCase();

if (!envDictionary[global.ENV]) {
  global.ENV = "dev";
}

let config = {};
let context;

// Helper functions for setting root
const setRootFromUrl = function(url) {
  config.root = dirname(fileURLToPath(url));
};

start.fromUrl = async function(url) {
  setRootFromUrl(url);
  return await start();
};

async function start() {
  const env = await import(
    `./${[envDictionary[global.ENV]]}/${[envDictionary[global.ENV]]}.js`
  );

  let bootData = await env.default(config);

  if (bootData.context) {
    context = bootData.context;
  }

  if (bootData.config) {
    config = bootData.config;
  }

  return bootData;
}

function getConfig() {
  return config;
}

function getContext() {
  if (context) {
    return context;
  } else {
    throw "Context can only be accessed after start/boot process";
  }
}

function getEnv() {
  return global.ENV;
}

export { start, setRootFromUrl, getConfig, getContext, getEnv };
