# API Documentation

## General Information

Base URL:
http://localhost:3000

Swagger UI:
http://localhost:3000/docs

OpenAPI JSON:
http://localhost:3000/docs.json

All responses are JSON.
All protected endpoints require the header:

Authorization: Bearer <JWT_TOKEN>

---

## Authentication

### POST /auth/register
Register a new user.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response:

201 Created

400 Bad Request

POST /auth/login
Authenticate a user and return a JWT.

Request body:

json
Copy code
{
  "email": "john@example.com",
  "password": "password123"
}
Response:

json
Copy code
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "roles": ["user"]
  }
}
PUT /me
Update current user information.

Requires authentication.

Request body (one or more fields):

json
Copy code
{
  "name": "New Name",
  "password": "newpassword"
}
Tables (Items)
GET /items
Get all active tables.

Query parameters:

q (search by name)

minCapacity

location

sort (default: name)

order (ASC or DESC)

limit

offset

Response:

json
Copy code
{
  "items": [
    {
      "id": 1,
      "name": "Table 1",
      "capacity": 4,
      "location": "Main",
      "active": true
    }
  ]
}
GET /items/:id
Get a single table by ID.

GET /items/:id/timeslots
Get all timeslots for a table with availability information.

Response:

json
Copy code
{
  "items": [
    {
      "id": 1,
      "start": "2024-01-01T18:00:00.000Z",
      "end": "2024-01-01T20:00:00.000Z",
      "available": true
    }
  ]
}
Reservations
POST /reservations
Create a reservation.

Requires authentication.

Request body:

json
Copy code
{
  "tableIds": [1, 2],
  "timeSlotId": 3,
  "partySize": 2
}
Response:

201 Created

409 Conflict if not available

GET /me/reservations
Get all reservations of the logged-in user.

Requires authentication.

GET /reservations/:id
Get a single reservation by ID.

Requires authentication.

DELETE /reservations/:id
Cancel a reservation.

Requires authentication.

Admin (Requires admin role)
GET /admin/users
Get all users (search supported with q).

GET /admin/users/:id
Get details of a single user.

PATCH /admin/users/:id/active
Activate or deactivate a user.

Request body:

json
Copy code
{
  "active": false
}
GET /admin/tables
Get all tables (including inactive).

POST /admin/tables
Create a new table.

PATCH /admin/tables/:id
Update an existing table.

DELETE /admin/tables/:id
Delete a table.

GET /admin/timeslots
Get all timeslots.

POST /admin/timeslots
Create a timeslot.

DELETE /admin/timeslots/:id
Delete a timeslot.

GET /admin/reservations
Get all reservations with filters.

GET /admin/settings
Get application settings.

PUT /admin/settings
Update application settings.