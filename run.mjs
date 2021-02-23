import {createServer} from "http";
import {createReadStream} from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";

import readline from "readline-promise";

import webext from "web-ext";

const rl = readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

const records = [];

const htmlServer = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  const match = req.url.match(/\/(\w+)\/\w+\.(\w+)/);
  if (match) {
    res.setHeader("Content-Type", "text/html");
    res.end(`<img src='http://localhost:8081/${match[1]}/test.png'>`);
    records.push({
      key: match[1], 
      type: match[2]
    });
    // console.log(records);
  }
});
htmlServer.listen(8080);

const imgServer = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)
  const match = req.url.match(/\/(\w+)\/\w+\.(\w+)/);
  if (match) {
    if (match[2] === "png") {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "max-age=31536000");
      res.setHeader("Expires", "Sun, 20 Feb 2022 15:10:56 GMT");
      res.setHeader("Last-Modified", "Fri, 09 Oct 2020 15:00:04 GMT");
      res.setHeader("x-content-type-options", "nosniff");
      const img = createReadStream(`${getDirname(import.meta.url)}/test.png`);
      img.pipe(res);
    } else {
      res.end();
    }
    records.push({
      key: match[1], 
      type: match[2]
    });
    // console.log(records);
  }
});
imgServer.listen(8081);

const options = {
  sourceDir: path.resolve("dist-extension"),
  target: process.argv[2],
  noInput: true,
  noReload: true
};

if (options.target === "firefox-desktop") {
  options.firefox = process.argv[3];
} else {
  options.chromiumBinary = process.argv[3];
}

const runner = await webext.cmd.run(options, {
  shouldExitProgram: false
});

await rl.questionAsync("press Enter to close browser\n");

await runner.exit();

// console.log(records);

htmlServer.close();
imgServer.close();
rl.close();

function getDirname(url) {
  return dirname(fileURLToPath(url));
}
