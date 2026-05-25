---
name: Nevis - Analyse Selection
description: "Security audit and code quality analysis of the currently selected code. Highlight code in the editor, then run this prompt."
agent: ask
argument-hint: "Select the code you want to analyse in the editor first"
inputs:
  - id: analysisType
    type: pickString
    description: "What kind of analysis do you want?"
    options:
      - label: "Security Audit — OWASP Top 10 check"
        value: "security audit based on OWASP Top 10 vulnerabilities"
      - label: "Code Review — bugs and quality issues"
        value: "code review focusing on bugs, logic errors, and code quality"
      - label: "Performance Review — find bottlenecks"
        value: "performance review to identify bottlenecks and inefficiencies"
      - label: "Test Coverage — suggest missing tests"
        value: "test coverage analysis suggesting missing unit and integration tests"
    default: "security audit based on OWASP Top 10 vulnerabilities"
---

# Analyse Selection

Perform a **${input:analysisType}** on the following code:

```
${selection}
```

For each finding include:

- **Location** — line or section reference where possible
- **Severity** — Critical / High / Medium / Low
- **Issue** — what the problem is
- **Fix** — a concrete, actionable recommendation

Present findings as a numbered list grouped by severity (Critical → High → Medium → Low).

If no issues are found at a given severity level, omit that group.
