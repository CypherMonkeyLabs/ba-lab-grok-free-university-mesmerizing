# Publishing

The lab is a static site. Relative paths only. This repository does not turn GitHub Pages on.

## Built

The installable web app is built.

- `manifest.webmanifest` names the lab, sets `display` to `standalone`, and points `start_url` at `index.html`.
- `sw.js` is network-first. The cache is used only when a request fails.
- `assets/js/pwa.js` registers that worker after the page loads.
- Icons at 192 and 512 pixels sit in `assets/icons/`.

A browser that supports installation can offer Add to Home Screen or Install once the site is served over HTTPS. A local file server does not complete that install prompt.

## Prepared, not built

These are drafts in the repo. They are not packaged, signed, or submitted.

| Target | What is in the repo | Status |
| --- | --- | --- |
| Chrome extension | `extension/manifest.json` is a draft with no host permissions and no background worker. | Prepared |
| Capacitor iOS and Android | No native project, no platform folders, and no store binaries. A later build could wrap these same static files. | Prepared as a note only |
| Embed widget / SDK | `embed/ba-widget.js` appends an iframe that loads `index.html` from the same folder. It is not a versioned SDK. | Prepared |

## Contact

Questions and removal requests go through the contact section on the lab website. The site does not publish an email address.
