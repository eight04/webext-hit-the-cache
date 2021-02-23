import copy from 'rollup-plugin-copy-glob';
import cjs from "rollup-plugin-cjs-es";
import iife from "rollup-plugin-iife";
// import inline from "rollup-plugin-inline-js";
// import json from "rollup-plugin-json";
import output from "rollup-plugin-write-output";
// import {terser} from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
// import inject from "@rollup/plugin-inject";

export default {
  input: ["src/content.mjs", "src/background.mjs"],
  output: {
    format: "es",
    dir: "dist-extension/"
  },
  plugins: [
    resolve(),
    cjs({nested: true}),
    copy([
      {
        files: "src/static/**/*",
        dest: "dist-extension"
      }
    ]),
    iife(),
    output([
      {
        test: /background\.js$/,
        target: "dist-extension/manifest.json",
        handle: (content, {scripts}) => {
          content.background.scripts = scripts;
          return content;
        }
      },
      {
        test: /content\.js$/,
        target: "dist-extension/manifest.json",
        handle: (content, {scripts}) => {
          content.content_scripts[0].js = scripts;
          return content;
        }
      }
    ])
  ]
};
