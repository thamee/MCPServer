---
mode: agent
description: Playwright automation prompt for the Urlist Angular app. Runs a full user journey and reports pass/fail results.
---

# Urlist — Playwright Test Scenarios

## App Under Test
- **URL**: http://localhost:4200
- **Framework**: Angular 17+
- **Page ID**: Use `open_browser_page` to get a pageId, then pass it to all browser tools.

---

## Scenario 1 — Home Page Loads
**Goal**: Verify the home page renders correctly.

Steps:
1. Navigate to `http://localhost:4200`
2. Assert page title is `Urlist`
3. Assert the heading `Urlist` is visible
4. Assert the URL input placeholder says `Paste a URL to get started…`
5. Assert the `Create List` button is **disabled** (no input yet)

Expected result: ✅ PASS if all elements are present and button is disabled.

---

## Scenario 2 — Create List from URL Input
**Goal**: Enter a URL on the home page and navigate to the compose view.

Steps:
1. Navigate to `http://localhost:4200`
2. Type `https://github.com/thamee` into the URL input
3. Assert the `Create List` button becomes **enabled**
4. Click the `Create List` button
5. Assert the URL changes to `/compose` or `/compose/:id`
6. Assert a link card for `github.com` appears on the page

Expected result: ✅ PASS if navigation to compose view succeeds and link card is shown.

---

## Scenario 3 — Add Multiple Links in Compose View
**Goal**: Add additional URLs to the list being composed.

Steps:
1. Navigate to `http://localhost:4200`
2. Type `https://github.com/thamee` into the URL input and click `Create List`
3. On the compose page, find the additional URL input field
4. Type `https://linkedin.com` and press Enter or click Add
5. Assert a second link card appears on the page

Expected result: ✅ PASS if two link cards are visible.

---

## Scenario 4 — Sign In Button Opens Modal
**Goal**: Verify the Sign In button in the header triggers the auth modal.

Steps:
1. Navigate to `http://localhost:4200`
2. Click the `Sign In` button in the header navigation
3. Assert a sign-in modal or dialog appears on the page

Expected result: ✅ PASS if the sign-in UI becomes visible.

---

## Scenario 5 — Empty URL Cannot Create List
**Goal**: Guard against creating a list with no URL.

Steps:
1. Navigate to `http://localhost:4200`
2. Leave the URL input empty
3. Assert the `Create List` button is disabled
4. Attempt to click it (should do nothing)
5. Assert the URL is still `http://localhost:4200/`

Expected result: ✅ PASS if the button stays disabled and no navigation occurs.

---

## Execution Instructions

When asked to run this prompt:
1. Use `open_browser_page` to open `http://localhost:4200` and get a pageId
2. Execute each scenario in order using `navigate_page`, `type_in_page`, `click_element`, `screenshot_page`, and `run_playwright_code`
3. After each scenario, report: **Scenario N — ✅ PASS** or **❌ FAIL — reason**
4. Take a screenshot after each scenario
5. Return a final summary table of all results
