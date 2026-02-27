# Backend (Spring Boot)

## Features
- JWT authentication (`POST /api/auth/login`)
- Public endpoints:
  - `GET /api/public/projects`
  - `GET /api/public/services`
  - `GET /api/public/skills`
  - `GET /api/public/testimonials`
  - `GET /api/public/videos`
  - `POST /api/messages`
- Admin endpoints (JWT required):
  - `/api/admin/projects`
  - `/api/admin/services`
  - `/api/admin/skills`
  - `/api/admin/testimonials`
  - `/api/admin/videos`
  - `/api/admin/messages`
  - `/api/admin/content`
  - `/api/admin/content/upload?type=resume|cv`
  - `/api/admin/content/documents` (extra blog docs)
- Validation + global JSON error responses
- Contact form persistence + SMTP email notification to `kelly123simiyu@gmail.com`

## Database
- MySQL via JPA/Hibernate
- `spring.jpa.hibernate.ddl-auto` defaults to `update` (auto schema creation/update)

## Environment Configuration
All values are mapped in `src/main/resources/application.properties`:
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH`, `SMTP_STARTTLS`
- `MAIL_TO`, `MAIL_FROM`
- `APP_ADMIN_USERNAME`, `APP_ADMIN_PASSWORD`, `APP_ADMIN_EMAIL`

## Run
```bash
mvn spring-boot:run
```

## Blog Documents API
- Public:
  - `GET /api/public/content/documents` (visible docs only)
  - `GET /api/public/content/documents/{id}/file?download=true|false`
- Admin (JWT required):
  - `GET /api/admin/content/documents`
  - `POST /api/admin/content/documents` (multipart: `file`, optional `title`, optional `visible`, `downloadEnabled`, `displayOrder`)
  - `PUT /api/admin/content/documents/{id}` (JSON: `title`, `visible`, `downloadEnabled`, `displayOrder`)
  - `DELETE /api/admin/content/documents/{id}`
