# Orbit — Consumer Intelligence Laboratory

A privacy-first React + TypeScript + Vite classroom dashboard. D3 powers its force-directed evidence network. Analysis stays in browser memory. No preloaded consumer profiles, synthetic student results, tracking, or external AI calls.

## Run

Use Node.js 22+ and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm package:extension
pnpm dev
```

Open the printed URL at `/consumer.profile/`. `pnpm build` type-checks and produces `dist/`. The GitHub Actions workflow tests, packages, builds, and deploys Pages after the repository's Pages source is set to GitHub Actions.

## Features

- Evidence-based overview; weighted network with label-propagation communities, dragging, zoom, search, filters, and an accessible website list.
- Radial time distribution, weekly heatmap, calendar, and monthly category flows.
- Tentative shopping signals and overlapping segments with evidence and minimum-data thresholds.
- Real product URL/catalog input; category-overlap recommendations, unverified-price disclosure, optional remote-image requests.
- Accurate/inaccurate/uncertain feedback; rejected hypotheses excluded from segments and recommendations.
- Source removal, record deletion, reset, Chrome disconnection, dark/light modes, responsive navigation.

## Supported imports

Never commit personal exports. Approve analysis in the file-import dialog.

- History CSV/JSON: `url`, `title`, `time` (ISO, Unix seconds/milliseconds/microseconds, or Chrome microseconds). Also recognizes `timestamp`, `date`, `visitTime`, `lastVisitTime`, `time_usec`.
- Google Takeout: `Browser History` JSON; My Activity with `titleUrl` and `time`.
- ChatGPT: `conversations.json` with `mapping` and `message.author.role`. User text only; quote removal is heuristic. ZIP recognizes conversations/history/myactivity JSON and CSV. Other files ignored.
- Orders: same record fields, requiring product URL and timestamp. No private receipt/account scraping; vendor schemas may need adaptation.
- Catalog: JSON `{ "products": [...] }` or CSV with `type=product`, `name`/`product_name`, `url`, optional `price`, `currency`, `image`, `captured_at`. Prices are user-supplied and never live verified.

Limits: 30 MB/file, 50,000 activity records/session, 500 imported products. Chrome caps: 5,000 URLs and 20,000 visits/request, with coverage warnings. Arbitrary HTML exports and automatic retailer extraction are unavailable.

## Methods and limitations

`src/engine.ts` publishes the taxonomy and scoring rules. Category share = category record count / all selected records. Product matches/segments require 3 category records. Shopping-style percentages require a denominator of 10; 30 increases the label from low to moderate confidence. None are validated psychological measures or calibrated probabilities. Missing timestamps are rejected, not invented. Visits do not prove purchases, motivations, budgets, or loyalty.

The extension requests optional history permission and checks the exact production origin/project path. No Chrome Web Store listing exists yet. See [installation and submission checklist](EXTENSION_DISTRIBUTION.md) and [privacy disclosure](PRIVACY.md).

## Testing

`pnpm test` uses development-only fixtures for parsing, inference, recommendation, and mocked extension-worker tests. Fixtures never appear as a student's profile. Installed-extension testing requires separate owner-authorized Chrome testing. See `QA.md` for the final verification record.
