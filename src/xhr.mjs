export function xhr(url, page) {
  return new Promise((resolve, reject) => {
    const XHR = page ? content.XMLHttpRequest : XMLHttpRequest;
    const r = new XHR;
    r.addEventListener("load", () => resolve(r.response.size));
    r.addEventListener("error", () => reject(new Error(`XHR error: ${url}`)));
    r.responseType = "blob";
    r.open("GET", url);
    r.send();
  });
}

export async function fetchBlob(url, {mode, page, referrer} = {}) {
  const _fetch = page ? content.fetch : fetch;
  const r = await _fetch(url, {mode, referrer});
  const b = await r.blob();
  return b.size;
}
