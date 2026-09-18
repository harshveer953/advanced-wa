# Smart WhatsApp Order Manager — Frontend

## Setup
1) Create `.env` from `.env.example`
2) Install deps
```bash
npm install
```

## Run
```bash
npm run dev
```

Backend should be running at `VITE_API_URL` (default `http://localhost:5000`).

## Notes
- JWT token stored in localStorage
- Axios auto-attaches token
- On 401, app logs out and redirects to `/login`
