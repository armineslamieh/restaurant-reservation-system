# Requirements Checklist

## Functional Requirements

| ID | Description | Status |
|----|-------------|--------|
| FR-01 | Users can view available tables | ✓ |
| FR-02 | Users can register and login | ✓ |
| FR-03 | Authentication uses JWT | ✓ |
| FR-04 | Users can create reservations | ✓ |
| FR-05 | Users can view their own reservations | ✓ |
| FR-06 | Users can cancel their reservations | ✓ |
| FR-07 | Admin can manage users | ✓ |
| FR-08 | Admin can manage tables | ✓ |
| FR-09 | Admin can manage timeslots | ✓ |
| FR-10 | Admin can view all reservations | ✓ |

---

## Non-Functional Requirements

| ID | Description | Status |
|----|-------------|--------|
| NFR-01 | REST API follows REST principles | ✓ |
| NFR-02 | API returns JSON responses | ✓ |
| NFR-03 | Proper HTTP status codes are used | ✓ |
| NFR-04 | Input validation is implemented on backend | ✓ |
| NFR-05 | Basic client-side validation is implemented | ✓ |
| NFR-06 | Authentication and authorization implemented | ✓ |
| NFR-07 | Passwords are encrypted | ✓ |
| NFR-08 | Roles are used (admin / user) | ✓ |
| NFR-09 | No external database dependency | ✓ |
| NFR-10 | Project runs locally without external services | ✓ |
| NFR-11 | Server Sent Events (SSE) | ✗ |
| NFR-12 | Clean project structure | ✓ |
| NFR-13 | No node_modules included in submission | ✓ |
| NFR-14 | Credentials are documented | ✓ |

---

## Notes

- This project does not implement Server Sent Events (SSE).
- The application is based on a classic REST architecture.
- Documentation reflects the actual implemented features.
