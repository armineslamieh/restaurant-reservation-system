# Credentials & Environment Configuration

## Default Admin Account

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not defined in `server/.env`, the backend automatically creates a default admin user.

Email: admin@example.com  
Password: admin123

This account can be used to access all admin functionality in the application.

---

## Server Environment Variables

Create a file `server/.env` based on `server/.env.example`.

Supported variables:

PORT  
Port on which the backend server runs (default: 3000)

JWT_SECRET  
Secret key used to sign JSON Web Tokens

JWT_EXPIRES  
Token expiration time (example: 1d)

ADMIN_EMAIL  
Email for the default admin user

ADMIN_PASSWORD  
Password for the default admin user

CORS_ORIGINS  
Allowed frontend origins (example: http://localhost:5173)

---

## Client Environment Variables

Create a file `client/.env`.

Required variable:

VITE_API_BASE  
Base URL of the backend API

Example:
VITE_API_BASE=http://localhost:3000

---

## How to Run

Backend:
cd server  
npm install  
npm start

Frontend:
cd client  
npm install  
npm run dev  
