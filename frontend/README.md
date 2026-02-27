# Frontend (React + Vite)

## Features
- Public premium glassmorphism site sections:
  - Hero, About, Services, Work, Skills, Testimonials, Videos, Contact
- Framer Motion animations:
  - Page transitions, section reveals, hover lift, floating hero elements
- Video showcase modal embed support for:
  - YouTube
  - Vimeo
  - Google Drive preview links
- Contact form integration with backend `POST /api/messages`
- Admin dashboard under `/admin`:
  - Login + JWT route protection
  - CRUD for Projects, Services, Skills, Testimonials, Videos
  - Messages inbox with read view
  - Search/filter/pagination for Projects and Videos

## Configure API URL
Optional:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
