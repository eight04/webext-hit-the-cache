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
   node run.mjs firefox-desktop-no-partition <path_to_executable>
   ```
   or 
   ```
   node run.mjs chromium <path_to_executable>
   ```
5. The extension will test `fetch`/`XMLHttpRequest` in different contexts.
6. When the test ends i.e. the extension stops creating tabs, close the browser.
7. Go back to the terminal and press enter to continue. (There is [a bug](https://github.com/mozilla/web-ext/issues/1569) preventing Firefox from closing, you may have to close it manually.)

Result
-------

### Firefox Developer Edition 94.0b9:

| Case                      | Hit the server | Success | File size |
| ------------------------- | -------------- | ------- | --------- |
| backgroundFetch           | 2              | true    | /564      |
| backgroundFetchNoCors     | 2              | true    | /564      |
| backgroundXHR             | 2              | true    | /564      |
| backgroundDownload        | 2              | true    | /564      |
| backgroundDownloadWithRef | 2              | true    | /564      |
| contentFetch              | 2              | true    | /564      |
| contentFetchNoCors        | 2              | true    | /564      |
| contentXHR                | 2              | true    | /564      |
| pageFetch                 | 2              | false   |           |
| pageFetchNoCors           | 2              | true    | /0        |
| pageXHR                   | 2              | false   |           |

* Only page requests failed.
* No requests hit the cache.

### Firefox Developer Edition 94.0b9 (no partition):

| Case                      | Hit the server | Success | File size |
| ------------------------- | -------------- | ------- | --------- |
| backgroundFetch           | 1              | true    | /564      |
| backgroundFetchNoCors     | 1              | true    | /564      |
| backgroundXHR             | 1              | true    | /564      |
| backgroundDownload        | 1              | true    | /564      |
| backgroundDownloadWithRef | 1              | true    | /564      |
| contentFetch              | 1              | true    | /564      |
| contentFetchNoCors        | 1              | true    | /564      |
| contentXHR                | 1              | true    | /564      |
| pageFetch                 | 2              | false   |           |
| pageFetchNoCors           | 2              | true    | /0        |
| pageXHR                   | 2              | false   |           |

* All succeeded requests hit the cache, including downloads API.
* Page requests failed.

### Firefox 78.15.0esr

| Case                      | Hit the server | Success | File size |
| ------------------------- | -------------- | ------- | --------- |
| backgroundFetch           | 1              | true    | /564      |
| backgroundFetchNoCors     | 1              | true    | /564      |
| backgroundXHR             | 1              | true    | /564      |
| backgroundDownload        | 1              | true    | /564      |
| backgroundDownloadWithRef | 1              | true    | /564      |
| contentFetch              | 1              | true    | /564      |
| contentFetchNoCors        | 1              | true    | /564      |
| contentXHR                | 1              | true    | /564      |
| pageFetch                 | 2              | false   |           |
| pageFetchNoCors           | 2              | true    | /0        |
| pageXHR                   | 2              | false   |           |

* Only page requests failed.
* All succeeded requests hit the cache, including downloads API

### Chrome 95.0.4638.54

| Case                      | Hit the server | Success | File size |
| ------------------------- | -------------- | ------- | --------- |
| backgroundFetch           | 2              | true    | /564      |
| backgroundFetchNoCors     | 2              | true    | /564      |
| backgroundXHR             | 2              | true    | /564      |
| backgroundDownload        | 2              | true    | /564      |
| backgroundDownloadWithRef | 1              | false   |           |
| contentFetch              | 1              | false   |           |
| contentFetchNoCors        | 1              | true    | /0        |
| contentXHR                | 1              | false   |           |
| pageFetch                 | 1              | false   |           |
| pageFetchNoCors           | 1              | false   |           |
| pageXHR                   | 1              | false   |           |

* Only background requests succeeded.
* Content requests failed and no-cors fetch got an opaque response.
* No requests hit the cache.
* Chrome doesn't support setting referrer in downloads API.

### Chrome 83.0.4103.116

| Case                      | Hit the server | Success | File size |
| ------------------------- | -------------- | ------- | --------- |
| backgroundFetch           | 1              | true    | /564      |
| backgroundFetchNoCors     | 1              | true    | /564      |
| backgroundXHR             | 1              | true    | /564      |
| backgroundDownload        | 2              | true    | /564      |
| backgroundDownloadWithRef | 1              | false   |           |
| contentFetch              | 1              | true    | /564      |
| contentFetchNoCors        | 1              | true    | /0        |
| contentXHR                | 1              | true    | /564      |
| pageFetch                 | 1              | false   |           |
| pageFetchNoCors           | 1              | false   |           |
| pageXHR                   | 1              | false   |           |

* Only page requests failed.
* Content fetch with no-cors get an opaque response.
* All succeeeded requests hit the cache, except downloads API.
