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
  },
  img({url}) {
    return new Promise((resolve, reject) => {
      const i = new Image;
      i.src = url + "#" + Math.random();
      i.onload = () => resolve(i.naturalWidth);
      i.onerror = () => reject(new Error(`Image load error: ${url}`));
      document.body.appendChild(i);
    } );
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
