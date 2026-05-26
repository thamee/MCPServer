---
mode: agent
description: Root cause analysis workflow. Reproduces a bug with Playwright, identifies the root cause in the codebase, applies the fix, then re-runs Playwright to confirm the issue is resolved.
argument-hint: "Provide the GitHub issue number to analyse (e.g. 'thamee/MCPServer#3')"
---

# Root Cause Analysis — Reproduce → Diagnose → Fix → Verify

## Issue to Analyse
${input}

---

## Phase 1 — Reproduce the Bug with Playwright

> Use the Playwright MCP browser tools to confirm the bug exists before touching any code.

1. Open a browser and navigate to `http://localhost:4200/chat`
2. Wait for the chat input to be visible and ready
3. Type the exact input that triggers the reported failure — infer this from the issue description (e.g. a country name with special characters such as `Côte d'Ivoire`)
4. Submit the message and wait for the response
5. **Record the result** — capture a screenshot and note whether the response is an error, a crash message, or unexpected output

**Expected at this stage:** the bug should reproduce. Document: ❌ FAIL — [describe what went wrong].

---

## Phase 2 — Diagnose the Root Cause

> Use the GitHub MCP server to read the full issue, then trace the problem in the source code.

1. Fetch the full issue body and comments from GitHub:
   - Owner and repo: extract from `${input}` (e.g. `thamee/MCPServer`)
   - Issue number: extract from `${input}`
2. Read the relevant source file(s) identified in the issue (e.g. `mcp-server/server.mjs`)
3. Locate the exact line(s) where the bug originates
4. State the root cause clearly:
   - **Root cause:** [one sentence explanation]
   - **Affected file:** [file path and line number]
   - **Why it fails:** [technical explanation]

---

## Phase 3 — Apply the Fix

> Edit the source file to resolve the root cause. Make the minimal change needed — do not refactor unrelated code.

1. Apply the fix directly to the affected file
2. Explain what was changed and why it resolves the issue
3. Do **not** change unrelated code or add unnecessary comments

---

## Phase 4 — Verify the Fix with Playwright

> Re-run the same browser scenario from Phase 1 to confirm the bug no longer occurs.

1. Ensure the server is running with the updated code (restart if needed)
2. Navigate to `http://localhost:4200/chat`
3. Type the same input that previously triggered the bug
4. Wait for the response and capture a screenshot
5. Assert the response is now correct and no error is shown

**Expected at this stage:** the bug should be gone. Document: ✅ PASS — [describe the correct response].

---

## Summary Report

Once all phases are complete, output a summary in this format:

```
## RCA Summary

**Issue:** [link to issue]
**Root Cause:** [one sentence]
**Fix Applied:** [file and change description]
**Verification:** ✅ PASS — confirmed working via Playwright browser test
```
