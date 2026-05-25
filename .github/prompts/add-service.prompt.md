---
description: "Create an Angular service to add users into the system, following the project's existing service patterns"
name: "Add User Service"
argument-hint: "Describe the user fields or registration behaviour (e.g. email + password, role assignment)"
agent: "agent"
tools: [search, codebase]
---

Create a new Angular service called `UserService` (or a name appropriate to the argument) that adds users into the system.

Follow the patterns already established in this project:

- Use `@Injectable({ providedIn: 'root' })` — no module registration needed
- Use Angular `signal()` for any reactive state that components might observe
- Persist data to `localStorage`, keyed with a constant `STORAGE_KEY` string
- Wrap all `localStorage` reads in a `try/catch` and return a safe default on failure
- Generate unique IDs with `crypto.randomUUID()`
- Define a TypeScript `interface` for the User entity in the same file or in `src/app/models/`

## User entity requirements

Include at minimum:
- `id: string` — generated via `crypto.randomUUID()`
- `username: string`
- `createdAt: string` — ISO date string

Add any extra fields described in the argument (e.g. `email`, `role`, `passwordHash`).

## Service must expose

- `addUser(data: Partial<User>): User` — validates uniqueness (username must not already exist), creates and persists the user, and returns the saved record
- `getUserById(id: string): User | null`
- `getAllUsers(): User[]`
- A `signal` named `users` that reflects the current list so components can subscribe reactively

## Constraints

- Do **not** store plain-text passwords; if a password field is required, note it with a `// TODO: hash before storing` comment
- Throw a descriptive `Error` (not a generic one) when a duplicate username is detected
- Place the file at `src/app/services/<kebab-name>.service.ts`

## Reference files

- [auth.service.ts](../../src/app/services/auth.service.ts) — signal + localStorage pattern
- [list.service.ts](../../src/app/services/list.service.ts) — CRUD + localStorage pattern
- [link-list.model.ts](../../src/app/models/link-list.model.ts) — model interface example
