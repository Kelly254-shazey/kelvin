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
2