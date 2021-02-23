import browser from "webextension-polyfill";
import {xhr, fetchBlob} from "./xhr.mjs";

init();

async function init() {
  await browserAction();

  const cases = {
    backgroundFetch: (url, tab, referrer) => fetchBlob(url, {referrer}),
    backgroundFetchNoCors: (url, tab, referrer) => fetchBlob(url, {mode: "no-cors", referrer}),
    backgroundXHR: (url, tab, referrer) => xhr(url),
    contentFetch: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "fetch", url, referrer}),
    contentFetchNoCors: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "fetch", url, mode: "no-cors", referrer}),
    contentXHR: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "xhr", url}),
    pageFetch: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "fetch", url, page: true, referrer}),
    pageFetchNoCors: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "fetch", url, page: true, mode: "no-cors", referrer}),
    pageXHR: (url, tab, referrer) => browser.tabs.sendMessage(tab.id, {method: "xhr", url, page: true}),
  };

  let i = 0;
  for (const key in cases) {
    console.log(i, key);
    const url = `http://localhost:8080/${key}/test.html`;
    const tab = await browser.tabs.create({
      url
    });
    await loadTab(tab);
    await browserAction();
    try {
      const blobSize = await cases[key](`http://localhost:8081/${key}/test.png`, tab, url);
      // console.log(blob.size);
      await fetch(`http://localhost:8081/${key}/test.success/${blobSize}`);
    } catch (err) {
      console.log(err);
    }
    // await browser.tabs.remove(tab.id);
    i++;
  }
}

function loadTab(tab) {
  return new Promise(resolve => {
    browser.runtime.onMessage.addListener(function listener(message, sender) {
      if (message.method === "pageLoad" && sender.tab.id === tab.id) {
        browser.runtime.onMessage.removeListener(listener);
        resolve();
      }
    });
    
    // browser.tabs.sendMessage(tab.id, {method: "checkPageLoad"});
  });
}

function browserAction() {
  // return new Promise(resolve => {
    // browser.browserAction.onClicked.addListener(function listener() {
      // resolve();
      // browser.browserAction.onClicked.removeListener(listener);
    // });
  // });
  return Promise.resolve();
}