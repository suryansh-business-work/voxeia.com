# Twilio Call Bot

Twilio based phone call system - make outbound calls using Twilio API.

## Project Structure

```
├── server/          # Node.js + TypeScript backend
│   └── src/
│       ├── calls/   # Call feature (controllers, services, routes, validators, models)
│       └── config/  # Environment config & interfaces
├── ui/              # React + TypeScript + MUI frontend
│   └── src/
│       ├── api/         # Axios client
│       ├── components/  # Shared components (Header, Footer, Breadcrumb)
│       ├── theme/       # MUI theme config
│       └── tools/
│           └── calls/   # Call feature UI (form, logs table, components)
```

## Environment Variables

⚠️ **First Time Setup**: See [TWILIO_SETUP.md](TWILIO_SETUP.md) for detailed instructions on getting your Twilio credentials.

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID (from Twilio Console) |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token (from Twilio Console) |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number in E.164 format (e.g., +1234567890) |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:3000) |

## Getting Started

### Server
```bash
cd server
npm install
npm run dev
```

### UI
```bash
cd ui
npm install
npm run dev
```

Server runs on `http://localhost:5000`, UI runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/calls` | Make an outbound call |
| `GET` | `/api/calls/logs` | Get call history with pagination & filters |
| `GET` | `/api/health` | Health check |
