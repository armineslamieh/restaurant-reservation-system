## How to Run Tests
```bash
cd 200/server
NODE_ENV=test npm test
Testing Tools
Vitest: Test runner for Node.js

Supertest: For testing Express endpoints via HTTP requests

Coverage Summary
Area	Description
Auth	Login success & invalid credentials
Items	Listing and filtering items
Reservations	Create & cancel (24-hour rule)
Admin	Protected routes (requires JWT & admin role)

Example Output
pgsql
Copy code
✓ Auth endpoints logs in as admin successfully
✓ Items endpoints returns list of items
✓ Reservations endpoints creates and cancels a reservation
✓ Admin endpoints lists users when admin
