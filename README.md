# Urlist

A modern Angular 18 application for creating, managing, and sharing curated link lists — with an AI-powered chat interface backed by a Model Context Protocol (MCP) server.

---

## Features

- **Create & manage link lists** — add URLs with auto-extracted metadata (site name, description, favicon)
- **OpenGraph scraping** — automatically fetches site name, description, and favicon for each link
- **Publish & share** — publish a list with a unique slug and share the public URL
- **My Links dashboard** — view and manage all lists belonging to the signed-in user
- **AI Chat** — conversational interface powered by the local MCP chat server, supporting:
  - 🌍 Country information (via REST Countries API)
  - 🌤 Real-time weather (via Open-Meteo API, no API key required)
  - 🎯 Trivia questions (via Open Trivia DB)
  - 🔍 GitHub PR review summary (via GitHub API)
- **Markdown rendering** — assistant replies are rendered as rich Markdown
- **Local auth** — lightweight sign-in stored in `localStorage`; no backend required for auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Angular 18 (standalone components) |
| Reactive state | Angular Signals + RxJS 7.8 |
| Styling | Component-scoped CSS |
| Chat backend | Node.js + Express (MCP server) |
| MCP SDK | `@modelcontextprotocol/sdk` |
| Input validation | Zod |
| Build tooling | Angular CLI 18 + TypeScript 5.5 |
| Testing | Karma + Jasmine |

---

## Project Structure

```
urlist/                         # Angular application root
├── src/
│   └── app/
│       ├── components/
│       │   ├── chat/           # AI chat UI
│       │   ├── header/         # Top navigation bar
│       │   ├── home/           # Landing / sign-in page
│       │   ├── link-card/      # Individual link preview card
│       │   ├── list-compose/   # Create & edit a link list
│       │   ├── my-links/       # User's saved lists
│       │   └── public-list/    # Shareable public list view
│       ├── models/
│       │   ├── link-item.model.ts   # Single URL entry
│       │   ├── link-list.model.ts   # Curated list + metadata
│       │   └── user.model.ts
│       ├── pipes/
│       │   └── markdown.pipe.ts     # Converts Markdown to HTML
│       └── services/
│           ├── auth.service.ts      # Signal-based local auth
│           ├── chat.service.ts      # HTTP client for MCP server
│           ├── list.service.ts      # CRUD for link lists (localStorage)
│           └── opengraph.service.ts # URL metadata extraction
mcp-server/                     # Express chat backend
├── server.mjs                  # MCP tools + /chat HTTP endpoint
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Angular CLI** 18: `npm install -g @angular/cli`

### Install & run the Angular app

```bash
cd urlist
npm install
npm start          # → http://localhost:4200
```

### Install & run the MCP Chat Server

```bash
cd mcp-server
npm install
npm start          # → http://localhost:3001
```

> The chat feature in the Angular app requires the MCP server to be running on port 3001.

---

## MCP Chat Server

The server (`mcp-server/server.mjs`) exposes a single REST endpoint:

```
POST http://localhost:3001/chat
Body: { "message": "<user message>" }
Response: { "reply": "<assistant reply>" }
```

### Tools exposed via MCP

| Tool | Description | API |
|---|---|---|
| `get_country` | Country facts (capital, population, languages, currency, flag) | REST Countries v3 |
| `get_weather` | Current weather conditions for any city | Open-Meteo (no key) |
| `get_trivia` | Random trivia question by category | Open Trivia DB |
| `review_github_pr` | PR summary with changed files and patches | GitHub REST API v3 |

---

## Available Scripts

Inside the `urlist/` directory:

| Command | Description |
|---|---|
| `npm start` / `ng serve` | Start dev server at `http://localhost:4200` |
| `ng build` | Production build to `dist/` |
| `ng test` | Run unit tests via Karma |
| `ng generate component <name>` | Scaffold a new standalone component |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Optional | Personal access token for GitHub API. Without it the PR review tool is subject to public rate limits (60 req/hr). |

Set it before starting the MCP server:

```bash
# Windows PowerShell
$env:GITHUB_TOKEN = "ghp_..."
npm start

# macOS / Linux
GITHUB_TOKEN=ghp_... npm start
```

---

## App Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomeComponent` | Landing page / sign-in |
| `/compose` | `ListComposeComponent` | Create a new link list |
| `/compose/:id` | `ListComposeComponent` | Edit an existing list |
| `/my-links` | `MyLinksComponent` | All lists for the current user |
| `/list/:slug` | `PublicListComponent` | Public shareable list view |
| `/chat` | `ChatComponent` | AI chat interface |

---

## Contributing

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and ensure tests pass (`ng test`).
3. Open a pull request against `main` with a clear description of what changed and why.
4. Branch naming convention: `feat/`, `fix/`, `docs/`, `chore/`.
