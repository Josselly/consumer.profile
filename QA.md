# Verification record

## Automated checks

- 27 Vitest tests pass: history/Takeout/CSV/ChatGPT parsing, quote and role separation, timestamp formats, malformed/unsupported records, conservative sensitive-topic exclusion, deduplication, catalog price provenance, inference denominators, deletion effects, missing-data thresholds, feedback exclusion, and empty recommendation behavior.
- Extension tests validate exact sender origin/project path, optional-only history permission, bounded periods, URL sanitization, denied-permission handling, and actual visit-time filtering using mocked Chrome APIs.
- TypeScript and the Vite production build pass. The production bundle includes no private imports or precomputed profile.
- Extension ZIP includes the manifest, worker/policy, bridge, toolbar UI, and icons.

## Browser checks

- Desktop initial state: zero records, no fabricated consumer results, clear connection/import actions.
- Explicit file-analysis checkbox gates parsing; connection dialog explains developer installation and absent Web Store listing.
- A local development-only fixture populated the graph and time views. Marking a category inaccurate removed its suggested segment. The fixture is outside the repository and is not a student profile or published dataset. The test session was cleared by reload.
- All nine navigation sections render appropriate headings and empty-data states.
- 390-pixel responsive viewport: document width and scroll width both 390, no horizontal overflow. Navigation drawer opens; desktop sizing restored afterward.
- Privacy controls and disclosures are present. Individual/source deletion and reset derive new state locally; automated tests verify removal changes inference counts.

## Verification limits

- No real personal records analyzed; real source connection remains off until the owner approves it.
- Extension installation, Chrome's native permission dialog, and installed content-script communication have **not** been tested on a real Chrome profile. Mocked worker tests do not replace those tests.
- No Chrome Web Store submission or approval. Developer installation is required for testing.
- Retailer scraping, live price/availability verification, and automatic product capture are unavailable. Add actual product URLs/metadata or import a catalog. Supplied prices are explicitly unverified.
- Taxonomy, sensitive-topic exclusions, and quote removal are heuristic and incomplete. Signals are not validated psychological assessments.
- Network view caps displayed nodes for performance. Automated timing benchmarks and mobile hardware testing have not been performed.
- GitHub Pages deployment status is verified separately through the repository's Actions/Pages UI; this document does not substitute for a successful deployment.
