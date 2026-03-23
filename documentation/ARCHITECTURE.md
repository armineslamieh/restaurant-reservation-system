# Architecture

## Overview
This application is a full-stack web project consisting of a Svelte frontend and a Node.js / Express backend. The backend exposes a REST API and uses a local SQLite database through Sequelize ORM. The frontend communicates with the backend using HTTP requests and JSON.

No Server-Sent Events (SSE) or HATEOAS links are implemented in this project.

---

## Frontend Architecture

**Technology**
- Svelte
- Vite
- Tailwind CSS

**Structure**
- `client/src/pages/`  
  Contains page-level Svelte components (Home, Login, Register, Tables, Reservations, Admin pages).
- `client/src/lib/`  
  Shared logic and reusable components:
    - `api.js` for HTTP requests
    - `stores/` for authentication state
    - UI components (cards, inputs, buttons, toasts)
- `client/src/App.svelte`  
  Root component that handles routing and global layout.

**Responsibilities**
- Render UI
- Handle client-side validation
- Send requests to backend
- Display feedback messages inside the application (no browser alerts)

---

## Backend Architecture

**Technology**
- Node.js
- Express
- Sequelize ORM
- SQLite database
- JWT for authentication

**Structure**
- `server/src/index.js`  
  Application entry point. Configures Express, middleware, Swagger, routes, and database.
- `server/src/routes/`  
  Route definitions grouped by domain:
    - `auth.js`
    - `items.js`
    - `reservations.js`
    - `admin.js`
- `server/src/middleware/`  
  Authentication and authorization middleware (JWT, role checks).
- `server/src/services/`  
  Business logic and reusable operations (used where applicable).
- `server/src/db/`  
  Sequelize models and database setup.
- `server/src/tests/`  
  Automated tests using Vitest and Supertest.

There is no controllers layer; route files handle request flow and delegate logic to services where needed.

---

## Database

**Type**
- SQLite (local file)

**Main Entities**
- User
- Role
- Table (Item)
- TimeSlot
- Reservation

**Relationships**
- Users can have multiple roles
- Reservations belong to a user
- Reservations reference one time slot
- Reservations can include multiple tables

---

## Communication

- Frontend communicates with backend via REST endpoints
- Data format: JSON
- Authentication via `Authorization: Bearer <token>` header

---

## Error Handling

Errors are returned as JSON objects:
```json
{
  "message": "Error description"
}
Common HTTP Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error