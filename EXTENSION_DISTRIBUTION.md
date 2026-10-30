# Extension distribution

Status: packaged for developer testing; **not submitted to or approved by the Chrome Web Store**. No listing URL exists.

## Temporary install

1. Download `extension.zip` from the dashboard and extract it, or use `extension/` from the repository.
2. Open Chrome → `chrome://extensions` → enable Developer mode → Load unpacked.
3. Select the folder containing `manifest.json`.
4. Open `https://josselly.github.io/consumer.profile/` in Chrome. Open Orbit in the extensions toolbar.
5. Read the disclosure, click Allow history access, and approve Chrome's prompt.
6. In the dashboard click Connect Chrome → Check connection → select a period → Approve & explore my profile.
7. Disconnect in Data & privacy to revoke permission; uninstall through Chrome's extension manager.

The production manifest excludes localhost and arbitrary origins. For local integration testing, create a separate developer copy and change content-script matches, bridge origin/path, worker sender policy, and popup link together. Do not widen the distributed manifest.

## Chrome Web Store listing draft

- Name: Orbit — Local Consumer Intelligence.
- Single purpose: With approval, transfer selected Chrome visits to Orbit for local, explainable consumer-interest analysis.
- Optional `history` justification: enumerate URLs and actual visit times for the chosen period. No modification APIs are used.
- Site access: content script restricted to `https://josselly.github.io/consumer.profile/*` for dashboard communication. No retailer injection.
- Data use: browsing records processed locally, not sold, used for advertising, or sent to servers. No passwords, raw cookies, account tokens, or financial transactions.
- Retention: dashboard memory until reload/close/reset; extension stores no history persistently.
- Remote code: none. No external scripts or AI APIs.
- Privacy policy: use the public repository's `PRIVACY.md` URL after publication.
- Assets prepared: 16/32/48/128-pixel PNG icons. Store screenshots/promotional imagery still need final-flow captures.
- Owner steps: developer enrollment and any fee, contact/listing details, privacy declarations reviewed against final implementation, real-Chrome verification, ZIP upload, and store review. Never add an Install Extension listing link until approval.

## Release QA

Automated worker tests mock Chrome APIs. They check sender validation, optional-permission handling, period bounds, sanitization, and actual visit filtering. They **do not** prove installation, browser permission prompts, installed content-script behavior, or store acceptance. Test these with explicit approval on a real Chrome profile before classroom rollout.
