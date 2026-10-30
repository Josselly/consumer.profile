# Orbit privacy disclosure

Orbit is a browser-local educational consumer intelligence application. The public GitHub repository and GitHub Pages contain application code and extension assets only. **Never commit personal exports or profiles.**

## Data processed

Only files you voluntarily choose after approving local analysis, or Chrome visit records you approve after granting the extension optional history permission. Fields include dates, sanitized URLs, page titles, user-authored conversation text, and supplied product metadata. Assistant/system/tool messages are excluded. Block quotes, quotation-mark text, and fenced code are removed heuristically; quoted material cannot be identified perfectly.

Chrome history is not accessed by signing in, by opening the site, or by downloading the extension. A toolbar popup requests Chrome permission. The dashboard then asks you to select a period and approve analysis. Chrome's history permission technically includes modification APIs, but Orbit does not call them.

## Processing and retention

Analysis is deterministic and local in browser memory. Raw imports, generated profiles, catalogs, and feedback are not placed in localStorage, IndexedDB, URLs, analytics, or external AI requests. Reloading or closing the tab clears session data. Browser back-forward cache can preserve a page session until reload. JavaScript memory is managed by the browser; this is not a forensic secure-erasure guarantee. Original files and Chrome history remain untouched.

URLs lose query strings and fragments; credential-bearing URLs are rejected. A conservative keyword/domain filter excludes known sensitive material. It is incomplete: review records before relying on a profile. No health, religion, political affiliation, sexuality, financial status, or demographic inferences are produced. Non-sensitive-looking URLs or titles can still contain private details; delete their imported copies as needed.

## Network behavior

GitHub Pages receives ordinary page/resource requests and may log IP addresses and request metadata under GitHub's policies. Personal records are never sent in these requests. No analytics, third-party fonts, external AI services, or retailer scraping. Clicking retailer links contacts the retailer. Remote product images are disabled until you explicitly load them; that sends a request to the image host (including your IP, without a referrer). No imported records are attached.

## Extension boundaries

The production extension injects only into `https://josselly.github.io/consumer.profile/*`. Bridge and worker verify the origin and project path. Only optional `history` is requested; no cookies, tabs, storage, scripting, account, or broad host permissions. Actual visit timestamps are read with `chrome.history.getVisits`, capped at 5,000 URLs and 20,000 visits/request. Large imports can be incomplete. Titles are Chrome's current title, not historical snapshots. Do not run untrusted scripts on the dashboard origin. GitHub Pages projects under the same account share an origin and its trust boundary.

Disconnect revokes Chrome history permission and clears Chrome records from the active dashboard. Toolbar revocation stops future reads; clear session data to remove already imported copies. Uninstalling the extension also revokes access.

## Controls and limitations

Review/delete individual records, remove imported sources, disconnect Chrome, or clear session data in Data & privacy. Parsers support documented JSON/CSV structures, not every vendor schema or arbitrary HTML exports. Prices are user-supplied, never live verified. Visits do not establish purchases or psychological traits. Store publication and real Chrome installation testing remain separate owner-approved steps. No public extension listing is claimed.
