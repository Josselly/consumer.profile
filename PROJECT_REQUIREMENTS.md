PROJECT FOLDER: Your local project folder (not published)
GITHUB REPOSITORY: https://github.com/Josselly/consumerprofile

MISSION: BUILD MY PERSONAL AI CONSUMER INTELLIGENCE LABORATORY

You are my autonomous AI software engineer, consumer behavior analyst, UX designer, and data visualization specialist.

Build a complete, professional, interactive AI Consumer Intelligence Laboratory that analyzes my REAL personal digital activity to discover my interests, consumer preferences, shopping tendencies, possible consumer segments, and personalized product recommendations.

This is a Digital Marketing classroom project demonstrating behavioral targeting, consumer profiling, personalization, AI inference, network analysis, and digital privacy.

IMPORTANT:
- Use actual personal data only. Never substitute fictional consumer profiles or fabricated behavioral evidence.
- Students should only need to supply the two values at the top of this prompt.
- Handle technical setup, implementation, testing, and deployment autonomously.
- Request explicit approval before accessing personal data or installing extensions.
- Keep all personal data private and never publish it to GitHub.
- Make Chrome connection as simple as technically possible.

1. AUTONOMOUS PROJECT SETUP

Use the project folder and GitHub repository above.

Inspect the environment, existing project files, operating system, installed tools, and available browser integrations.

If an existing implementation is present, improve and preserve it instead of rebuilding unnecessarily.

Use React, TypeScript, Vite, and appropriate visualization libraries. Install necessary dependencies.

Configure the project for GitHub Pages deployment.

Do not ask students to manually write code or configure build tools.

2. SIMPLE CHROME CONNECTION

The intended experience is:

CONNECT CHROME → APPROVE PERMISSION → EXPLORE MY PROFILE

First investigate whether an authorized Chrome integration can access browsing history.

Do not assume that Google login or a connected browser session grants browsing-history access.

If direct access is unavailable, build a lightweight Chrome Manifest V3 extension using the chrome.history API.

The extension must:
- Request only the necessary history permission.
- Clearly explain what data will be accessed.
- Ask for explicit Chrome permission approval.
- Connect only to the authorized dashboard origin.
- Transfer approved history data locally to the dashboard.
- Never access passwords, raw cookies, authentication tokens, or protected credentials.
- Allow users to disconnect and revoke access.

Avoid unnecessary settings, repeated toggles, manual data transfers, and complicated configuration.

Prepare the extension for Chrome Web Store publication, including its manifest, icons, privacy disclosures, permission justifications, and installation instructions.

If a verified Chrome Web Store listing is available, provide a prominent Install Extension button linking to that listing.

Never invent a Chrome Web Store URL or claim that publication has occurred before approval.

Until publication is complete, provide a clearly explained temporary installation workflow for testing.

The GitHub Pages dashboard must never falsely claim it can directly read Chrome history without the required extension or authorized integration.

After permission is granted, allow the student to select a history period and start analysis with one clear action.

3. ADDITIONAL PERSONAL DATA SOURCES

Support optional imports of:
- Google Takeout browsing and activity exports
- ChatGPT conversation-history exports
- Personal shopping and order-history exports
- CSV and JSON browsing records
- Product catalog files

Provide a simple drag-and-drop interface.

Use only records voluntarily provided by the user.

For conversation exports, distinguish the user's own statements from assistant-generated text and quoted material.

Never silently access private accounts, files, or personal records.

4. REAL CONSUMER BEHAVIOR ANALYSIS

Analyze authorized personal records to identify:
- Frequently visited websites
- Interest categories
- Brand interests
- Shopping-related activity
- Product research patterns
- Browsing frequency and recency
- Time-of-day behavior
- Repeated versus exploratory browsing
- Price comparison behavior
- Product category affinities
- Changes in interests over time
- Relationships between interests, brands, websites, and products

Separate directly observed behavior from inferred preferences.

Use transparent scoring methods, show supporting evidence, and label uncertainty.

Do not infer sensitive characteristics such as health conditions, religion, political beliefs, or sexuality.

If evidence is insufficient, explicitly say INSUFFICIENT DATA.

5. SOPHISTICATED VISUAL DESIGN

Create a premium, visually impressive dashboard inspired by modern intelligence platforms, knowledge graphs, and advanced network visualization software.

Visual inspiration:
https://www.instagram.com/reel/DcHPKO-gQLs/
https://www.instagram.com/p/DV5EiR5iJYU/

Inspect these references if accessible. Otherwise, use an original professional visualization design.

Design requirements:
- Persistent left navigation sidebar
- Clean, modern interface
- Dark and light modes
- Beautiful typography
- Smooth transitions and animations
- Responsive desktop and mobile layouts
- Interactive charts and networks
- Detailed hover and click interactions
- Elegant filtering and search
- Strong visual hierarchy

Ordinary bar charts must not be the main attraction.

Use D3.js, Cytoscape.js, Sigma.js, Graphology, or similar libraries for network visualization.

6. DASHBOARD SECTIONS

Create the following navigation sections:

A. CONSUMER OVERVIEW
Show my actual inferred consumer profile, major interest clusters, shopping tendencies, and strongest evidence-based insights.

B. INTEREST UNIVERSE
Create a spectacular interactive force-directed network graph connecting websites, brands, product categories, searches, and interests.

Include weighted connections, clustering, community detection, node sizing, zooming, panning, dragging, animated transitions, filters, and search.

Clicking a node should reveal the behavioral records and inference methods supporting its relationships.

C. DIGITAL FOOTPRINT
Show browsing behavior through radial timelines, interactive heatmaps, activity calendars, category flows, and other advanced visualizations.

D. PERSONALITY & SHOPPING STYLE
Estimate non-sensitive consumer tendencies such as price sensitivity, novelty seeking, brand exploration, convenience orientation, research intensity, and premium versus value orientation.

Treat these as tentative behavioral interpretations, not validated psychological personality measurements.

Show the evidence, method, limitations, and uncertainty for each inference.

E. CONSUMER SEGMENTS
Identify possible consumer segments and show overlapping segment memberships with transparent scoring and supporting evidence.

F. PRODUCT DISCOVERY
Allow users to enter retailer URLs such as Amazon, Walmart, Target, or Best Buy.

Use authorized browser access or permitted publicly available product information to discover real products.

Respect retailer access restrictions. Never bypass anti-bot protections.

If automatic discovery is unavailable, allow students to capture products through the Chrome extension or import product URLs/catalog files.

G. PERSONALIZED RECOMMENDATIONS
Recommend real products based on the user's inferred preferences.

Display product names, available images, verified prices, source links, match scores, and explanations.

Never fabricate product details, prices, ratings, or availability.

Explain how each recommendation relates to the consumer profile.

H. AI VS. REALITY
Allow students to evaluate inferred preferences as accurate, inaccurate, or uncertain.

Update the consumer profile based on feedback.

Show how self-reported preferences differ from AI-generated predictions.

I. DATA CONNECTIONS & PRIVACY
Show connected sources, permissions, record counts, import status, and data coverage.

Allow students to remove individual records, disconnect Chrome, delete imported data, and reset the dashboard.

7. PRIVACY-FIRST ARCHITECTURE

Publish only application code and public assets to GitHub Pages.

Never publish browsing history, conversation records, personal profiles, identifiers, or private datasets.

Process personal data locally wherever possible.

Do not transmit personal records to external AI APIs, analytics services, or other third parties without separate informed authorization.

Do not store raw imported records persistently by default.

Provide clear explanations of what information is analyzed and how the resulting profile is generated.

The public dashboard must not expose personal information in source code, repository history, URLs, or static assets.

8. TESTING AND QUALITY ASSURANCE

Test:
- Chrome extension permissions and communication
- Browser connection flow
- History import and parsing
- Consumer inference methods
- Network visualization performance
- Dashboard navigation
- Product discovery and recommendations
- Feedback interactions
- Responsive layouts
- Privacy controls and deletion
- GitHub Pages deployment

Use development fixtures for testing only. Never display fictional test results as the student's actual profile.

Clearly distinguish automated extension tests from real installation tests.

Fix errors before deployment.

9. DEPLOYMENT AND FINAL HANDOFF

Commit and push the completed application to the specified GitHub repository.

Configure GitHub Pages and verify the live website where possible.

Prepare the Chrome extension for distribution.

Do not claim that the extension is publicly installable until its Chrome Web Store listing has been approved.

Provide:
- Live dashboard URL
- GitHub repository URL
- Chrome extension installation status
- Data connection status
- Number of real records analyzed
- Completed dashboard features
- Product recommendation capabilities
- Testing results
- Remaining technical limitations
- Minimum manual steps required from students

FINAL REQUIREMENT

The project should feel like a polished commercial consumer intelligence platform, not a basic classroom charting exercise.

Prioritize sophisticated network visualizations, meaningful real-data analysis, explainable consumer profiling, and personalized product recommendations.

Make the student experience as simple as possible:

CONNECT CHROME → APPROVE PERMISSION → EXPLORE MY PROFILE

Complete the project autonomously, stopping only for genuinely necessary permissions, external approvals, or unavailable personal data.

Never claim to have analyzed personal data until actual authorized records have been processed.
