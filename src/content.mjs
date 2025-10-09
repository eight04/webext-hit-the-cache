import browser from "webextension-polyfill";
import {xhr, fetchBlob} from "./xhr.mjs";

function callEval(f, ...args) {
  return window.eval(`(${f.toString()})(${args.map(a => JSON.stringify(a)).join(',')})`);
}

const METHODS = {
  fetch({url, ...args}) {
    if (args.eval && args.page) {
      delete args.eval;
      delete args.page;
      return callEval(fetchBlob, url, args);
    }
    return fetchBlob(url, args);
  },
  xhr(args) {
    if (args.eval && args.page) {
      delete args.eval;
      delete args.page;
      return callEval(xhr, args);
    }
    return xhr(args);
  },
  async checkPageLoad() {
    if (document.readyState === "complete") {
      browser.runtime.sendMessage({method: "pageLoad"});
    }
  }
}

browser.runtime.onMessage.addListener(msg => {
  console.log(msg);
  return METHODS[msg.method](msg);
});

window.addEventListener("load", e => {
  console.log(e);
  browser.runtime.sendMessage({method: "pageLoad"});
});
