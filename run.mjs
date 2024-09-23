import dns from 'dns';
import {createServer} from "http";
import {createReadStream} from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";

import readline from "readline-promise";
import {markdownTable} from 'markdown-table';

import webext from "web-ext";

dns.setDefaultResultOrder('ipv4first');

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
  }
  records.push(getRecord(req.url));
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
    records.push(getRecord(req.url));
  }
});
imgServer.listen(8081);

const options = {
  sourceDir: path.resolve("dist-extension"),
  target: process.argv[2],
  noInput: true,
  noReload: true,
};

if (options.target === 'firefox-desktop-no-partition') {
  options.target = 'firefox-desktop';
  options.pref =   {
    'privacy.partition.network_state': false
  };
}

if (options.target === 'chromium-no-partition') {
  options.target = 'chromium';
  options.args = [
    '--disable-features=SplitCacheByNetworkIsolationKey'
  ]
}

if (options.target === "firefox-desktop") {
  options.firefox = process.argv[3];
} else if (options.target === "chromium") {
  options.chromiumBinary = process.argv[3];
} else {
  throw new Error(`Unknown target: ${options.target}`);
}

const runner = await webext.cmd.run(options, {
  shouldExitProgram: false
});

await rl.questionAsync("press Enter to close browser\n");

await runner.exit();

// console.log(records);

// analyze records
const cases = new Map;
for (const r of records) {
  if (!r) continue;
  if (!cases.has(r.case)) {
    cases.set(r.case, {
      hit: 0,
      success: false,
      extra: ''
    });
  }
  const o = cases.get(r.case);
  if (r.filename === 'test.png') {
    o.hit++;
  }
  if (r.filename === 'test.success') {
    o.success = true;
    o.extra = r.extra;
  }
}

const rows = [
  ['Case', 'Hit the server', 'Success', 'File size']
];
for (const [case_, o] of cases.entries()) {
  rows.push([
    case_,
    o.hit,
    o.success,
    o.extra
  ]);
}
console.log(markdownTable(rows));

htmlServer.close();
imgServer.close();
rl.close();

function getDirname(url) {
  return dirname(fileURLToPath(url));
}

function getRecord(url) {
  const match = url.match(/^\/(\w+)\/([^/]+)(.*)/);
  if (!match) {
    return null;
  }
  return {
    case: match[1],
    filename: match[2],
    extra: match[3]
  };
}
