# Urlist

A modern Angular 18 application for creating, managing, and sharing curated link lists — with an AI-powered chat interface backed by a Model Context Protocol (MCP) server.

---

## Features

- **Create & manage link lists** — add URLs with auto-extracted metadata (site name, description, favicon)
- **OpenGraph scraping** — automatically fetches site name, description, and favicon for each link using the Google favicon API
- **Publish & share** — publish a list with a randomly generated unique slug and share the public URL (`/list/:slug`)
- **My Links dashboard** — view and manage all lists belonging to the signed-in user
- **AI Chat** — conversational interface powered by the local MCP chat server, supporting:
  - 🌍 Country information (capital, population, region, languages, currency, flag)
  - 🌤 Real-time weather for any city worldwide (no API key required)
  - 🎯 Trivia questions across 17+ categories
  - 🔍 GitHub PR review summary (changed files with diffs)
- **Markdown rendering** — assistant replies are rendered as rich Markdown
- **Local auth** — lightweight username-based sign-in persisted to `localStorage`; no backend required

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Angular 18 (standalone components, lazy routing) |
| Reactive state | Angular Signals + RxJS 7.8 |
| Styling | Component-scoped CSS |
| Chat backend | Node.js + Express |
| MCP SDK | `@modelcontextprotocol/sdk` v1.11+ |
| Schema validation | Zod |
| Build tooling | Angular CLI 18 + TypeScript 5.5 |
| Testing | Karma + Jasmine |

---

## Project Structure

```
urlist/                          # Angular application root
├── src/
│   └── app/
│       ├── components/
│       │   ├── chat/            # AI chat UI (ChatComponent)
│       │   ├── header/          # Top navigation bar
│       │   ├── home/            # Landing / sign-in page
│       │   ├── link-card/       # Individual link preview card
│       │   ├── list-compose/    # Create & edit a link list
│       │   ├── my-links/        # User's saved lists
│       │   └── public-list/     # Shareable public list view
│       ├── models/
│       │   ├── link-item.model.ts    # Single URL entry
│       │   ├── link-list.model.ts    # Curated list + metadata
│       │   └── user.model.ts
│       ├── pipes/
│       │   └── markdown.pipe.ts      # Converts Markdown to HTML
│       └── services/
│           ├── auth.service.ts       # Signal-based local auth
│           ├── chat.service.ts       # HTTP client → MCP server
│           ├── list.service.ts       # CRUD for link lists (localStorage)
│           ├── opengraph.service.ts  # URL normalisation + favicon
│           └── ui-state.service.ts   # Shared UI state
mcp-server/                      # Express + MCP chat backend
├── server.mjs                   # Tool definitions + /chat HTTP endpoint
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Angular CLI** 18:
  ```bash
  npm install -g @angular/cli
  ```

### 1 — Install & run the Angular app

```bash
cd urlist
npm install
npm start         # → http://localhost:4200
```

### 2 — Install & run the MCP Chat Server

```bash
cd mcp-server
npm install
npm start         # → http://localhost:3001
```

> The `/chat` feature requires the MCP server running on port **3001**. Start both processes in separate terminals.

---

## App Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomeComponent` | Landing page / sign-in |
| `/compose` | `ListComposeComponent` | Create a new link list |
| `/compose/:id` | `ListComposeComponent` | Edit an existing list |
| `/my-links` | `MyLinksComponent` | All lists for the signed-in user |
| `/list/:slug` | `PublicListComponent` | Public shareable list view |
| `/chat` | `ChatComponent` | AI chat interface |

All routes use lazy-loaded standalone components.

---

## MCP Chat Server

The server (`mcp-server/server.mjs`) exposes a single REST endpoint:

```
POST http://localhost:3001/chat
Content-Type: application/json

{ "message": "<user message>" }
→ { "reply": "<assistant markdown reply>" }
```

### Exposed MCP tools

| Tool | Description | Data source |
|---|---|---|
| `get_country_info` | Country facts — capital, population, region, languages, currency, flag emoji | REST Countries v3.1 |
| `get_weather` | Current temperature, humidity, wind speed, and conditions for any city | Open-Meteo (no API key) |
| `get_trivia` | Random multiple-choice trivia question by category | Open Trivia DB |
| `review_github_pr` | PR metadata, description, and changed-file diffs (up to 30 files) | GitHub REST API v3 |

---

## Available Scripts

### Inside `urlist/`

| Command | Description |
|---|---|
| `npm start` / `ng serve` | Dev server at `http://localhost:4200` with live reload |
| `ng build` | Production build to `dist/urlist/` |
| `ng test` | Run unit tests via Karma |
| `ng generate component <name>` | Scaffold a new standalone component |

### Inside `mcp-server/`

| Command | Description |
|---|---|
| `npm start` | Start the MCP chat server on port 3001 |
| `npm run dev` | Start with `--watch` for auto-reload during development |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Optional | GitHub personal access token. Without it the `review_github_pr` tool is subject to the public rate limit (60 req/hr). |

Set before starting the MCP server:

```bash
# Windows PowerShell
$env:GITHUB_TOKEN = "ghp_your_token_here"
npm start

# macOS / Linux
GITHUB_TOKEN=ghp_your_token_here npm start
```

---

## Contributing

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and ensure all tests pass:
   ```bash
   ng test
   ```
3. Open a pull request against `main` with a clear title and description.

**Branch naming convention:** `feat/`, `fix/`, `docs/`, `chore/`
