# Voxeia — AI-Powered Business Calling Platform

> **[voxeia.com](https://voxeia.com)** | **[app.voxeia.com](https://app.voxeia.com)** | **[api.voxeia.com](https://api.voxeia.com)**

Voxeia automates outbound business calls using AI voice agents powered by Twilio, OpenAI, Amazon Polly, and real-time streaming. Upload contacts, configure an AI agent, launch campaigns, and monitor results — all from a single dashboard.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  voxeia.com       (SaaS Website)     :2000 — Astro + Tailwind  │
│  app.voxeia.com   (Dashboard UI)     :2001 — React + MUI       │
│  api.voxeia.com   (REST API)         :2002 — Express + TS      │
│  ws.voxeia.com    (WebSocket)        :2003 — Socket.IO          │
│  ecomm.voxeia.com (E-commerce Demo)  :2004 — React + MUI       │
│  MongoDB Atlas    (Database)         cloud                      │
└─────────────────────────────────────────────────────────────────┘
```

## Features

- **AI Voice Agents** — GPT-4 powered conversations with natural voices (Amazon Polly Neural, ElevenLabs, Deepgram)
- **Real-time Streaming** — Live call audio streaming with bidirectional AI responses
- **Campaign Management** — Schedule calls, auto-retry, bulk outreach
- **Contact Management** — CSV import, CRM-ready contact lists
- **Call Logs & Analytics** — Full history with pagination, filters, search, and sentiment analysis
- **Prompt Library** — Reusable conversation scripts and templates
- **Multi-company Support** — White-label ready with company-level isolation
- **Scheduled Calls** — Cron-based call scheduling with timezone support

## Project Structure

```
├── server/              # Node.js + Express + TypeScript API
│   └── src/
│       ├── agents/      # AI agent configuration
│       ├── ai/          # AI/LLM integration (OpenAI, prompts)
│       ├── auth/        # Authentication (JWT, middleware)
│       ├── calls/       # Twilio call initiation
│       ├── calllogs/    # Call history & analytics
│       ├── companies/   # Multi-company management
│       ├── contacts/    # Contact lists & CSV import
│       ├── config/      # Environment config, DB, ImageKit, mail
│       ├── emails/      # Email notifications
│       ├── middleware/   # Auth middleware
│       ├── promptlibrary/  # Reusable prompt templates
│       ├── scheduledcalls/ # Cron-based scheduling
│       ├── settings/    # App-level settings
│       ├── streaming/   # Real-time AI call streaming
│       ├── tts/         # Text-to-speech (Polly, ElevenLabs, Deepgram)
│       ├── tunnel/      # Cloudflare tunnel (dev only)
│       ├── utils/       # Shared utilities
│       └── websocket/   # Socket.IO real-time events
├── ui/                  # React + TypeScript + MUI dashboard
│   └── src/
│       ├── api/         # Axios API client
│       ├── components/  # Shared components
│       ├── context/     # React Context providers
│       ├── theme/       # MUI theme configuration
│       └── tools/       # Feature modules (calls, contacts, agents, etc.)
├── saas-website/        # Astro + Tailwind CSS v4 marketing site
│   └── src/
│       ├── components/  # Navbar, Footer
│       ├── layouts/     # Shared HTML layout
│       ├── pages/       # All pages (home, about, pricing, use-cases, contact, legal)
│       └── styles/      # Global CSS + design tokens
├── docker-compose.yml          # Local development (all services)
├── docker-compose.prod.yml     # Production (no MongoDB — uses Atlas)
└── .github/workflows/          # CI/CD pipelines
    ├── build.yml               # Build verification
    ├── type-lint-check.yml     # TypeScript + lint checks
    ├── deploy.yml              # Full infra deploy (SSL, nginx, all services)
    ├── deploy-server.yml       # Server-only deploy
    ├── deploy-ui.yml           # UI-only deploy
    └── deploy-website.yml      # Website-only deploy
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- MongoDB Atlas account (or local MongoDB for dev)
- Twilio account with phone number
- OpenAI API key

### Local Development

```bash
# Server
cd server && npm install && npm run dev

# UI (separate terminal)
cd ui && npm install && npm run dev

# SaaS Website (separate terminal)
cd saas-website && npm install && npm run dev
```

### Docker Compose (All Services)

```bash
docker compose up -d
```

| Service | Port | URL |
|---|---|---|
| UI | 2001 | http://localhost:2001 |
| API | 2002 | http://localhost:2002 |
| WebSocket | 2003 | ws://localhost:2003 |
| Website | 2000 | http://localhost:2000 |
| Ecomm Demo | 2004 | http://localhost:2004 |
| MongoDB | 27017 | mongodb://localhost:27017 |

### Production

Production uses **MongoDB Atlas** (no self-hosted MongoDB).  
All services deploy via GitHub Actions to a VPS behind nginx with SSL.

| Domain | Service |
|---|---|
| `voxeia.com` | SaaS marketing website |
| `app.voxeia.com` | Dashboard UI |
| `api.voxeia.com` | REST API |
| `ws.voxeia.com` | WebSocket |

## Environment Variables

Copy `server/.env.example` to `server/.env`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas in prod) |
| `NODE_ENV` | `development` or `production` |
| `BASE_URL` | Public base URL (e.g. `https://api.voxeia.com`) |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `https://app.voxeia.com`) |
| `JWT_SECRET` | Secret for JWT token signing |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number (E.164 format) |
| `OPENAI_API_KEY` | OpenAI API key |

## CI/CD

GitHub Actions workflows trigger on push to `main`:

- **build.yml** — Builds server, UI, and website
- **type-lint-check.yml** — TypeScript strict checks + linting
- **deploy.yml** — Full infrastructure deploy (nginx, SSL, all containers)
- **deploy-server.yml** — Server-only redeploy (triggers on `server/**` changes)
- **deploy-ui.yml** — UI-only redeploy (triggers on `ui/**` changes)
- **deploy-website.yml** — Website-only redeploy (triggers on `saas-website/**` changes)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token |
| `VPS_HOST` | VPS IP address |
| `VPS_USERNAME` | SSH username |
| `VPS_SSH_KEY` | SSH private key |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number |
| `OPENAI_API_KEY` | OpenAI API key |
| `SSL_EMAIL` | Email for Let's Encrypt SSL certificates |
| `BASE_URL` | Production API base URL |
| `CLIENT_URL` | Production UI URL |

## Documentation

- **[TWILIO_SETUP.md](TWILIO_SETUP.md)** — Twilio credentials setup guide
- **[VOICE_GUIDE.md](VOICE_GUIDE.md)** — Writing natural-sounding AI call scripts

## License

Proprietary — All rights reserved.
