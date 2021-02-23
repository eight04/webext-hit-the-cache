import browser from "webextension-polyfill";
import {xhr, fetchBlob} from "./xhr.mjs";

const METHODS = {
  fetch({url, mode, page}) {
    return fetchBlob(url, {mode, page});
    // const _fetch = page ? content.fetch : fetch;
    // return _fetch(url, {mode});
  },
  xhr({url, page}) {
    return xhr(url, page);
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
