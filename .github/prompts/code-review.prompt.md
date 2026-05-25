---
name: Code Review
description: "Perform a thorough code review of the selected code or a specified file. Highlights bugs, security issues, performance problems, and style violations."
agent: ask
model: "o4-mini (copilot)"
argument-hint: "Select the code to review, or specify a file path (e.g. 'Review src/app/services/list.service.ts')"
inputs:
  - id: reviewFocus
    type: pickString
    description: "What aspect should the review prioritise?"
    options:
      - label: "General — all categories"
        value: "all categories: correctness, security, performance, readability, and Angular best practices"
      - label: "Security — OWASP Top 10 + Angular"
        value: "security issues including XSS, injection, insecure data handling, and Angular-specific risks such as unsafe innerHTML bindings"
      - label: "Performance — change detection & bundles"
        value: "performance: unnecessary change detection cycles, missing OnPush strategy, unsubscribed observables, large bundle contributions, and slow DOM operations"
      - label: "Correctness — logic & edge cases"
        value: "correctness: logic errors, unhandled edge cases, null/undefined risks, and incorrect TypeScript types"
      - label: "Angular best practices"
        value: "Angular best practices: component design, service responsibilities, signal usage, lazy loading, and adherence to the Angular style guide"
    default: "all categories: correctness, security, performance, readability, and Angular best practices"
---

# Code Review

Review the following code focusing on **${input:reviewFocus}**:

```
${selection}
```

## Project Context

Refer to the full product requirements when evaluating correctness and feature alignment: [Requirements](src/docs/requirements.md)

This is an Angular application (`urlist`). Key conventions:
- Components live in `src/app/components/`, services in `src/app/services/`, models in `src/app/models/`
- Models use TypeScript interfaces only — no classes, no `any`
- Services are injected via `inject()` or constructor DI
- Existing services: `AuthService`, `ListService`, `OpenGraphService`, `UiStateService`

## Review Checklist

### Correctness
- Logic errors or off-by-one mistakes
- Unhandled `null` / `undefined` cases
- Incorrect or overly broad TypeScript types (`any`, missing generics)
- Promises or Observables that are not awaited / subscribed

### Security
- XSS risks (direct DOM manipulation, unsafe `innerHTML` bindings, `bypassSecurityTrust*`)
- Sensitive data exposed in logs, local storage, or templates
- Missing input validation or sanitisation at system boundaries

### Performance
- Components missing `ChangeDetectionStrategy.OnPush` where applicable
- Observable subscriptions without `takeUntilDestroyed` / `async` pipe (memory leaks)
- Expensive operations inside template expressions or `ngOnChanges`
- Unnecessary re-renders or redundant HTTP calls

### Readability & Maintainability
- Functions or methods that do more than one thing
- Magic numbers or hardcoded strings that should be constants
- Misleading variable / method names

### Angular Best Practices
- Business logic in components instead of services
- Direct DOM access (`document.querySelector`, `ElementRef.nativeElement`) without justification
- Missing `OnDestroy` teardown or `DestroyRef` usage
- Improper use of `@Input` / `@Output` vs signals

## Output Format

Structure the response as:

1. **Summary** — one paragraph overall assessment
2. **Issues** — a numbered list, each item with:
   - Severity: `critical` | `major` | `minor` | `suggestion`
   - Category (Correctness / Security / Performance / Readability / Angular)
   - Description of the problem
   - Suggested fix with a code snippet where helpful
3. **Positives** — briefly note what is done well (max 3 bullet points)
