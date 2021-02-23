webext-hit-the-cache
====================

This repo contains some experiment result of "How to hit the browser cache" which are used by the extension "Image Picka".

Run the test
------------

1. Install node.js.
2. In the project root, run `npm install`.
3. run `npm run build` to build the extension.
4. According to the browser you want to test, run either:
   ```
   node run.mjs firefox-desktop <path_to_executable>
   ```
   or 
   ```
   node run.mjs chromium <path_to_executable>
   ```
5. The extension will test `fetch`/`XMLHttpRequest` in different contexts.
6. When the test ends i.e. the extension stops creating tabs, close the browser.
7. Go back to the terminal and press enter to continue.
8. You will get a list of requests the server received.

   * If there is a `.success` request then the extension had fetched the image successfully. The number is the size of the blob.
   * If there are two `.png` requests then the extension didn't hit the cache.

Result
-------

### Firefox Developer Edition 86.0b9:

<details>

```
GET /backgroundFetch/test.html
GET /backgroundFetch/test.png
GET /favicon.ico
GET /backgroundFetch/test.png
GET /backgroundFetch/test.success/564
GET /backgroundFetchNoCors/test.html
GET /backgroundFetchNoCors/test.png
GET /favicon.ico
GET /backgroundFetchNoCors/test.png
GET /backgroundFetchNoCors/test.success/564
GET /backgroundXHR/test.html
GET /backgroundXHR/test.png
GET /favicon.ico
GET /backgroundXHR/test.png
GET /backgroundXHR/test.success/564
GET /contentFetch/test.html
GET /contentFetch/test.png
GET /favicon.ico
GET /contentFetch/test.png
GET /contentFetch/test.success/564
GET /contentFetchNoCors/test.html
GET /contentFetchNoCors/test.png
GET /favicon.ico
GET /contentFetchNoCors/test.png
GET /contentFetchNoCors/test.success/564
GET /contentXHR/test.html
GET /contentXHR/test.png
GET /favicon.ico
GET /contentXHR/test.png
GET /contentXHR/test.success/564
GET /pageFetch/test.html
GET /pageFetch/test.png
GET /favicon.ico
GET /pageFetch/test.png
GET /pageFetchNoCors/test.html
GET /pageFetchNoCors/test.png
GET /favicon.ico
GET /pageFetchNoCors/test.png
GET /pageFetchNoCors/test.success/0
GET /pageXHR/test.html
GET /pageXHR/test.png
GET /favicon.ico
GET /pageXHR/test.png
```
</details>

* Only page requests failed.
* No requests hit the cache.

### Firefox ESR 78.7.1

<details>

```
GET /backgroundFetch/test.html
GET /backgroundFetch/test.png
GET /favicon.icon
GET /backgroundFetch/test.success/564
GET /backgroundFetchNoCors/test.html
GET /backgroundFetchNoCors/test.png
GET /favicon.ico
GET /backgroundFetchNoCors/test.success/564
GET /backgroundXHR/test.html
GET /backgroundXHR/test.png
GET /favicon.ico
GET /backgroundXHR/test.success/564
GET /contentFetch/test.html
GET /contentFetch/test.png
GET /favicon.ico
GET /contentFetch/test.success/564
GET /contentFetchNoCors/test.html
GET /contentFetchNoCors/test.png
GET /favicon.ico
GET /contentFetchNoCors/test.success/564
GET /contentXHR/test.html
GET /contentXHR/test.png
GET /favicon.ico
GET /contentXHR/test.success/564
GET /pageFetch/test.html
GET /pageFetch/test.png
GET /favicon.ico
GET /pageFetch/test.png
GET /pageFetchNoCors/test.html
GET /pageFetchNoCors/test.png
GET /favicon.ico
GET /pageFetchNoCors/test.png
GET /pageFetchNoCors/test.success/0
GET /pageXHR/test.html
GET /pageXHR/test.png
GET /pageXHR/test.png
GET /favicon.ico
```
</details>

* Only page requests failed.
* All succeeded requests hit the cache.

### Chrome 88.0.4324.182

<details>

```
GET /backgroundFetch/test.html
GET /backgroundFetch/test.png
GET /favicon.ico
GET /backgroundFetch/test.png
GET /backgroundFetch/test.success/564
GET /backgroundFetchNoCors/test.html
GET /backgroundFetchNoCors/test.png
GET /backgroundFetchNoCors/test.png
GET /backgroundFetchNoCors/test.success/564
GET /backgroundXHR/test.html
GET /backgroundXHR/test.png
GET /backgroundXHR/test.png
GET /backgroundXHR/test.success/564
GET /contentFetch/test.html
GET /contentFetch/test.png
GET /contentFetchNoCors/test.html
GET /contentFetchNoCors/test.png
GET /contentFetchNoCors/test.success/0
GET /contentXHR/test.html
GET /contentXHR/test.png
GET /pageFetch/test.html
GET /pageFetch/test.png
GET /pageFetchNoCors/test.html
GET /pageFetchNoCors/test.png
GET /pageXHR/test.html
GET /pageXHR/test.png
```
</details>

* Only background requests succeeded.
* Content requests failed and no-cors fetch got an opaque response.
* No requests hit the cache.

### Chrome 83.0.4103.0

<details>

```
GET /backgroundFetch/test.html
GET /backgroundFetch/test.png
GET /favicon.ico
GET /backgroundFetch/test.success/564
GET /backgroundFetchNoCors/test.html
GET /backgroundFetchNoCors/test.png
GET /backgroundFetchNoCors/test.success/564
GET /backgroundXHR/test.html
GET /backgroundXHR/test.png
GET /backgroundXHR/test.success/564
GET /contentFetch/test.html
GET /contentFetch/test.png
GET /contentFetch/test.success/564
GET /contentFetchNoCors/test.html
GET /contentFetchNoCors/test.png
GET /contentFetchNoCors/test.success/0
GET /contentXHR/test.html
GET /contentXHR/test.png
GET /contentXHR/test.success/564
GET /pageFetch/test.html
GET /pageFetch/test.png
GET /pageFetchNoCors/test.html
GET /pageFetchNoCors/test.png
GET /pageXHR/test.html
GET /pageXHR/test.png
```
</details>

* Only page requests failed.
* Content fetch with no-cors get an opaque response.
* All succeeeded requests hit the cache.
