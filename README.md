# KELLYFLO Portfolio System

Full-stack portfolio platform for **Kelvin Simiyu** branded **KELLYFLO**.

## Stack
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Spring Boot (Web, Security, JWT, JPA/Hibernate, Mail)
- Database: MySQL
- Media: video links only (YouTube / Vimeo / Google Drive)

## Folder Structure
- `frontend/` React public site + admin dashboard (`/admin`)
- `backend/` Spring Boot API + JWT security + MySQL persistence

## Run
1. Backend
```bash
cd backend
mvn spring-boot:run
```
If Maven reports `No plugin found for prefix 'spring-boot'`, run:
```bash
mvn -f backend/pom.xml org.springframework.boot:spring-boot-maven-plugin:run
```
2. Frontend
```bash
cd frontend
npm install
npm run dev
``

Update these via environment variables before production use.
