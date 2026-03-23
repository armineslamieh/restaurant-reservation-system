# Credentials and Environment Variables

## Default Admin Account

If no admin credentials are provided in the server environment variables, the backend automatically creates a default admin user on startup.

Email: admin@example.com  
Password: admin123

This account can be used to access all admin features in the application.

---

## Server Environment Configuration

Create a file named `.env` inside the `server` folder based on `.env.example`.

Supported environment variables:

PORT  
Defines the port on which the backend server runs (default: 3000)

JWT_SECRET  
Secret key used to sign JSON Web Tokens

JWT_EXPIRES  
Expiration time for JWT tokens (example: 1d)

ADMIN_EMAIL  
Email address for the default admin user

ADMIN_PASSWORD  
Password for the default admin user

CORS_ORIGINS  
Allowed frontend origins (example: http://localhost:5173)

---

## Client Environment Configuration

Create a file named `.env` inside the `client` folder.

Required variable:

VITE_API_BASE  
Base URL of the backend API

Example:
VITE_API_BASE=http://localhost:3000

---

## Running the Application

Backend:
cd server  
npm install  
npm start

Frontend:
cd client  
npm install  
npm run dev  
