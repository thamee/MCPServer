---
name: Nevis - Generate Unit Test
description: "Generate a unit test for the currently selected code using your chosen framework and style. Highlight the code in the editor, then run this prompt."
agent: ask
argument-hint: "Select the code you want to generate a unit test for"
inputs:
  - id: testFramework
    type: pickString
    description: "Which testing framework and style?"
    options:
      - label: "Jasmine + Karma (Angular default)"
        value: "Jasmine and Karma, following Angular CLI conventions with TestBed where appropriate"
      - label: "Jest — unit tests only"
        value: "Jest with no Angular TestBed, pure unit tests using jest.fn() for mocks"
      - label: "Jest + Angular Testing Library"
        value: "Jest combined with Angular Testing Library (@testing-library/angular), focusing on user behaviour over implementation details"
      - label: "Vitest — lightweight and fast"
        value: "Vitest with vi.fn() for mocks, written as plain describe/it blocks without Angular TestBed"
    default: "Jasmine and Karma, following Angular CLI conventions with TestBed where appropriate"
---

# Generate Unit Test

Generate a unit test for the following code using **${input:testFramework}**:

```
${selection}
```

## Requirements

- Cover the **happy path** and at least one **edge case** per public method or function
- Mock all external dependencies (services, HTTP calls, signals) — do not test implementation internals
- Use descriptive `describe` / `it` (or `test`) block names that read as plain English
- Include **setup** (`beforeEach` / `beforeAll`) and **teardown** (`afterEach` / `afterAll`) where needed
- Assert on **observable behaviour** (return values, state changes, emitted events) not on internal calls unless strictly necessary

## Output Format

Provide the complete test file, ready to copy-paste, with:
1. All necessary imports at the top
2. A single top-level `describe` block named after the class or function under test
3. Inline comments only where the test logic is non-obvious
