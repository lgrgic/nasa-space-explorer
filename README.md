## NASA Space Explorer

React + Node/Express app that explores NASA NEO (asteroids) data with filters, charts, and an AI analysis.

Live:

- Frontend (Vercel): https://nasa-space-explorer-green.vercel.app/
- Backend (Render): https://nasa-space-explorer-txd9.onrender.com

### Local development

1. Install

```
cd backend && npm install
cd frontend && npm install
```

2. Environment

- create backend/.env file and add following variables

```
NASA_API_KEY=DEMO_KEY
OPENAI_KEY=//optional_for_ai
PORT=3001

- for AI analysis OPENAI_KEY is needed. Let me know if you need one.
```

```

3. Run

```

cd backend && npm run dev
cd ../frontend && npm run dev

```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Features

- Date range + additional filters (hazard, distance, size, velocity)
- Pagination (server-side) with React Query on the client
- Charts and timeline for close approaches
- AI analysis (optional, requires OPENAI_KEY)
- Caching (server + HTTP cache headers)
- Security middleware (helmet, CORS, rate limit, XSS)
- 3D earth in three.js - zoom in/out/rotate (webgl browser support needed)
```
