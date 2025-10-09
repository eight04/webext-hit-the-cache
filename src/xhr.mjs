/* global content */

export function xhr(args) {
  return new Promise((resolve, reject) => {
    const XHR = args.page ? content.XMLHttpRequest : XMLHttpRequest;
    const r = new XHR;
    r.addEventListener("load", () => resolve(r.response.size));
    r.addEventListener("error", () => reject(new Error(`XHR error: ${args.url}`)));
    r.responseType = "blob";
    r.open("GET", args.url);
    r.send();
  });
}

export async function fetchBlob(url, {mode, page, referrer} = {}) {
  const _fetch = page ? content.fetch : fetch;
  const r = await _fetch(url, {mode, referrer});
  const b = await r.blob();
  return b.size;
}
